/* eslint-disable @typescript-eslint/no-require-imports -- CommonJS loader for isolated TypeScript service tests. */
const { test } = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const ts = require('typescript');
const path = require('node:path');

// Load the actual TypeScript service with isolated SDK/network doubles. No
// real charges or CRM records are created by this suite.
function load(relative, overrides = {}) {
  const filename = path.join(__dirname, '..', relative);
  const js = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
  }).outputText;
  const compiledModule = { exports: {} };
  new Function('require', 'module', 'exports', js)((name) => {
    if (name in overrides) return overrides[name];
    if (name === '@/lib/config') return load('src/lib/config.ts');
    return require(name);
  }, compiledModule, compiledModule.exports);
  return compiledModule.exports;
}
const input = { fullName: 'Payment Test', mobileNumber: '9000000000', whatsappSameAsMobile: true,
  email: 'test@example.com', city: 'Test', profession: 'Other', learningGoal: '', consent: true,
  referredBy: '', utmSource: '', utmMedium: '', utmCampaign: '' };

test('local one-rupee price override cannot affect production', () => {
  const originalMode = process.env.NODE_ENV;
  const originalFlag = process.env.NEXT_PUBLIC_LOCAL_PAYMENT_TEST;
  try {
    process.env.NEXT_PUBLIC_LOCAL_PAYMENT_TEST = 'true';
    process.env.NODE_ENV = 'development';
    assert.equal(load('src/lib/config.ts').WEBINAR_CONFIG.WEBINAR_PRICE, 1);
    process.env.NODE_ENV = 'production';
    assert.equal(load('src/lib/config.ts').WEBINAR_CONFIG.WEBINAR_PRICE, 299);
    assert.equal(load('src/lib/config.ts').WEBINAR_CONFIG.LOCAL_PAYMENT_TEST, false);
    process.env.NODE_ENV = 'development';
    delete process.env.NEXT_PUBLIC_LOCAL_PAYMENT_TEST;
    assert.equal(load('src/lib/config.ts').WEBINAR_CONFIG.WEBINAR_PRICE, 299);
  } finally {
    if (originalMode === undefined) delete process.env.NODE_ENV; else process.env.NODE_ENV = originalMode;
    if (originalFlag === undefined) delete process.env.NEXT_PUBLIC_LOCAL_PAYMENT_TEST; else process.env.NEXT_PUBLIC_LOCAL_PAYMENT_TEST = originalFlag;
  }
});

test('signature validation rejects forged, malformed and changed payment receipts', () => {
  const { validSignature } = load('src/lib/server/webinar-payment.ts');
  const signature = crypto.createHmac('sha256', 'test-secret').update('order_1|pay_1').digest('hex');
  assert.equal(validSignature('order_1|pay_1', signature, 'test-secret'), true);
  assert.equal(validSignature('order_1|pay_2', signature, 'test-secret'), false);
  for (const bad of [null, {}, 'x', 'g'.repeat(64)]) assert.equal(validSignature('order_1|pay_1', bad, 'test-secret'), false);
});

test('registration validation enforces consent and preserves Hindi answers in order notes', () => {
  const { registrationPayload, orderNotes } = load('src/lib/server/webinar-payment.ts');
  assert.throws(() => registrationPayload({ ...input, consent: false }));
  assert.throws(() => registrationPayload({ ...input, mobileNumber: '123' }));
  const payload = registrationPayload({ ...input, fullName: 'गौरव सैनी', webinarMode: 'FREE', webinarName: 'Changed' });
  assert.equal(payload.webinarMode, 'PAID');
  const notes = orderNotes(payload);
  assert.ok(Object.keys(notes).length <= 15);
  assert.ok(Object.values(notes).every(value => value.length <= 256));
  assert.deepEqual(JSON.parse(Array.from({ length: 10 }, (_, i) => notes[`registration_${i}`] ?? '').join('')), payload);
});

test('capture, admin sync, duplicate retries, amount tampering and CRM failure', async () => {
  process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID = 'rzp_test_unit';
  process.env.RAZORPAY_KEY_SECRET = 'unit-secret';
  let order, payment, writes = 0, captures = 0, failCrm = false, crmStatus = 'PAID';
  class FakeRazorpay {
    orders = {
      fetch: async () => structuredClone(order),
      edit: async (_id, data) => { order.notes = data.notes; return order; },
    };
    payments = {
      fetch: async () => structuredClone(payment),
      capture: async (_id, amount, currency) => {
        assert.equal(amount, 29900); assert.equal(currency, 'INR'); captures++;
        payment.status = 'captured'; return payment;
      },
    };
  }
  const service = load('src/lib/server/webinar-payment.ts', { razorpay: FakeRazorpay });
  const reset = () => {
    order = { id: 'order_unit', amount: 29900, currency: 'INR', notes: service.orderNotes(service.registrationPayload(input)) };
    payment = { id: 'pay_unit', order_id: order.id, amount: 29900, currency: 'INR', status: 'authorized', amount_refunded: 0 };
  };
  const originalFetch = global.fetch;
  global.fetch = async (_url, request) => {
    writes++;
    assert.equal(JSON.parse(request.body).source, 'ai_automation_webinar_test_paid');
    assert.equal(JSON.parse(request.body).payment_status, 'PAID');
    assert.equal(payment.status, 'captured', 'Never mark a lead paid before capture');
    return new Response(JSON.stringify({ id: 'lead_unit', payment_status: crmStatus, created_at: '2026-10-15T00:00:00Z' }), { status: failCrm ? 503 : 201 });
  };
  try {
    reset();
    const [a, b] = await Promise.all([service.finalizePayment(order.id, payment.id), service.finalizePayment(order.id, payment.id)]);
    assert.deepEqual(a, b); assert.equal(writes, 1); assert.equal(captures, 1);
    const again = await service.finalizePayment(order.id, payment.id);
    assert.equal(again.leadId, 'lead_unit'); assert.equal(writes, 1);
    reset(); payment.amount = 100;
    await assert.rejects(service.finalizePayment(order.id, payment.id), /amount/);
    assert.equal(writes, 1);
    reset(); payment.order_id = 'order_other';
    await assert.rejects(service.finalizePayment(order.id, payment.id), /does not belong/);
    reset(); payment.status = 'failed';
    await assert.rejects(service.finalizePayment(order.id, payment.id), /not completed/);
    reset(); failCrm = true;
    await assert.rejects(service.finalizePayment(order.id, payment.id), /do not pay again/);
    assert.equal(payment.status, 'captured'); assert.equal(order.notes.crm_lead_id, undefined);
    failCrm = false;
    const recovered = await service.finalizePayment(order.id, payment.id);
    assert.equal(recovered.leadId, 'lead_unit'); assert.equal(captures, 2);
    reset(); crmStatus = 'PENDING';
    await assert.rejects(service.finalizePayment(order.id, payment.id), /admin payment status was not saved/);
    const previousWrites = writes;
    await assert.rejects(service.finalizePayment(order.id, payment.id), /admin payment status was not saved/);
    assert.equal(writes, previousWrites, 'Do not duplicate a lead when the API ignores paid status');
  } finally { global.fetch = originalFetch; }
});
