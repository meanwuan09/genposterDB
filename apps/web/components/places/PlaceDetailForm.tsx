'use client';

import { useState } from 'react';
import type { PlaceDetail } from '../../lib/types';

export function PlaceDetailForm({ place, token }: { place: PlaceDetail; token: string }) {
  const [message, setMessage] = useState('');

  async function save(formData: FormData) {
    setMessage('Đang lưu...');
    const body = Object.fromEntries(formData.entries());

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3000/api/v1'}/places/${place.id}`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: body.name,
        categoryId: Number(body.categoryId),
        serviceType: body.serviceType || null,
        mealType: body.mealType || null,
        style: body.style || null,
        highlights: body.highlights || null,
        note: body.note || null,
        address: body.address || null,
        district: body.district || null,
        city: body.city || null,
        priceText: body.priceText || null,
        openingHours: body.openingHours || null,
        phone: body.phone || null,
        isActive: body.isActive === 'on'
      })
    });

    setMessage(response.ok ? 'Đã lưu thông tin quán.' : 'Lưu thất bại.');
  }

  return (
    <form className="form-card card page" action={save}>
      <h2>Thông tin quán</h2>
      {message ? <p className="badge">{message}</p> : null}
      <div className="form-grid">
        <Field name="name" label="Tên quán" defaultValue={place.name} required />
        <Field name="categoryId" label="Category ID" defaultValue={String(place.categoryId)} required />
        <Field name="serviceType" label="Loại dịch vụ" defaultValue={place.serviceType ?? ''} />
        <Field name="mealType" label="Meal type" defaultValue={place.mealType ?? ''} />
        <Field name="style" label="Style" defaultValue={place.style ?? ''} />
        <Field name="address" label="Địa chỉ" defaultValue={place.address ?? ''} />
        <Field name="district" label="Quận/Huyện" defaultValue={place.district ?? ''} />
        <Field name="city" label="Thành phố" defaultValue={place.city ?? ''} />
        <Field name="priceText" label="Giá" defaultValue={place.priceText ?? ''} />
        <Field name="openingHours" label="Giờ mở cửa" defaultValue={place.openingHours ?? ''} />
        <Field name="phone" label="Phone" defaultValue={place.phone ?? ''} />
        <label className="field"><span>Active</span><input name="isActive" type="checkbox" defaultChecked={place.isActive} /></label>
      </div>
      <div className="field">
        <label htmlFor="highlights">Highlights</label>
        <textarea id="highlights" name="highlights" defaultValue={place.highlights ?? ''} />
      </div>
      <div className="field">
        <label htmlFor="note">Note</label>
        <textarea id="note" name="note" defaultValue={place.note ?? ''} />
      </div>
      <button type="submit">Lưu thông tin</button>
    </form>
  );
}

function Field(props: { name: string; label: string; defaultValue: string; required?: boolean }) {
  return <label className="field"><span>{props.label}</span><input name={props.name} defaultValue={props.defaultValue} required={props.required} /></label>;
}
