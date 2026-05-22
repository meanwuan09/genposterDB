'use client';

import { useState } from 'react';
import type { PlaceDetail, Role } from '../../lib/types';

export function PlacePartnerForm({ place, token, role }: { place: PlaceDetail; token: string; role: Role }) {
  const [message, setMessage] = useState('');
  const canEdit = role === 'admin';

  async function save(formData: FormData) {
    if (!canEdit) return;

    setMessage('Đang lưu...');
    const body = Object.fromEntries(formData.entries());
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3000/api/v1'}/places/${place.id}/partner`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ partnerRelation: body.partnerRelation === 'true' ? 'true' : 'false', partnerPriority: Number(body.partnerPriority ?? 0) })
    });

    setMessage(response.ok ? 'Đã lưu partner.' : 'Lưu partner thất bại.');
  }

  return (
    <form className="form-card card page" action={save}>
      <div>
        <h2>Partner</h2>
        <p className="muted">{canEdit ? 'Admin có thể chỉnh sửa thông tin partner.' : 'Staff chỉ được xem thông tin partner.'}</p>
      </div>
      {message ? <p className="badge">{message}</p> : null}
      <div className="form-grid">
        <label className="field">
          <span>Partner</span>
          <select name="partnerRelation" defaultValue={place.partnerRelation === 'true' ? 'true' : 'false'} disabled={!canEdit}>
            <option value="false">False</option>
            <option value="true">True</option>
          </select>
        </label>
        <label className="field">
          <span>Partner priority</span>
          <input name="partnerPriority" type="number" defaultValue={place.partnerPriority} disabled={!canEdit} />
        </label>
      </div>
      {canEdit ? <button type="submit">Lưu partner</button> : null}
    </form>
  );
}
