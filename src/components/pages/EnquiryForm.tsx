'use client';

import { useState } from 'react';
import { WHEEL } from '@/lib/content';

export default function EnquiryForm() {
  const [sent, setSent] = useState(false);
  return (
    <form
      className="enquiry panel-soft"
      onSubmit={e => {
        e.preventDefault();
        setSent(true);
      }}
    >
      <div className="enquiry-row">
        <label htmlFor="f-name">Name<input id="f-name" name="name" required autoComplete="name" /></label>
        <label htmlFor="f-phone">Phone<input id="f-phone" name="phone" type="tel" required autoComplete="tel" /></label>
      </div>
      <div className="enquiry-row">
        <label htmlFor="f-email">Email<input id="f-email" name="email" type="email" autoComplete="email" /></label>
        <label htmlFor="f-company">Company<input id="f-company" name="company" autoComplete="organization" /></label>
      </div>
      <div className="enquiry-row">
        <label htmlFor="f-sector">Sector
          <select id="f-sector" name="sector" defaultValue="Residential">
            <option>Residential</option>
            <option>Corporate</option>
            <option>Hospitality</option>
          </select>
        </label>
        <label htmlFor="f-service">Service
          <select id="f-service" name="service" defaultValue={WHEEL[1].name}>
            {WHEEL.map(w => (
              <option key={w.name}>{w.name}</option>
            ))}
          </select>
        </label>
      </div>
      <div className="enquiry-row">
        <label htmlFor="f-budget">Project size
          <select id="f-budget" name="budget" defaultValue="₹3–5 lakh">
            <option>₹3–5 lakh</option>
            <option>₹5–10 lakh</option>
            <option>₹10 lakh +</option>
          </select>
        </label>
        <label htmlFor="f-area">Site area (sq ft)<input id="f-area" name="area" inputMode="numeric" /></label>
      </div>
      <label htmlFor="f-location">Site location<input id="f-location" name="location" /></label>
      <label htmlFor="f-msg">Tell us about the site<textarea id="f-msg" name="message" rows={4} /></label>
      <button className="btn btn-dark" type="submit">Send enquiry</button>
      {sent && <p className="form-note">Thanks. This demo form does not send yet; it will email Abhi sir and the team once connected.</p>}
    </form>
  );
}
