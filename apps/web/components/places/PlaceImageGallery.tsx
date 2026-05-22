'use client';

import { useState } from 'react';
import type { PlaceMedia } from '../../lib/types';

export function PlaceImageGallery({ placeId, media, token }: { placeId: number; media: PlaceMedia[]; token: string }) {
  const [items, setItems] = useState(media);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState('');

  function toggle(id: number) {
    setSelectedIds((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  }

  async function refreshPlace() {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://127.0.0.1:3000/api/v1'}/places/${placeId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const place = await response.json();
    setItems(place.media ?? []);
    setSelectedIds([]);
  }

  async function uploadFile() {
    if (!file) return;
    setMessage('Đang upload ảnh...');
    const formData = new FormData();
    formData.set('file', file);

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://127.0.0.1:3000/api/v1'}/places/${placeId}/media/upload`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData
    });

    if (!response.ok) {
      setMessage('Upload ảnh thất bại.');
      return;
    }

    setMessage('Đã upload ảnh.');
    setFile(null);
    await refreshPlace();
  }

  async function deleteSelected() {
    if (!selectedIds.length) return;
    if (!window.confirm(`Xóa ${selectedIds.length} ảnh khỏi quán này?`)) return;

    setMessage('Đang xóa ảnh...');
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://127.0.0.1:3000/api/v1'}/places/${placeId}/media/bulk-delete`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids: selectedIds })
    });

    if (!response.ok) {
      setMessage('Xóa ảnh thất bại.');
      return;
    }

    setMessage('Đã xóa ảnh đã chọn.');
    await refreshPlace();
  }

  return (
    <div className="page">
      <div className="actions" style={{ justifyContent: 'space-between' }}>
        <div className="actions">
          <button type="button" className="danger" disabled={!selectedIds.length} onClick={deleteSelected}>Xóa ảnh đã chọn ({selectedIds.length})</button>
          <button type="button" className="secondary" onClick={() => setSelectedIds(items.map((item) => item.id))}>Chọn tất cả</button>
          <button type="button" className="secondary" onClick={() => setSelectedIds([])}>Bỏ chọn</button>
        </div>
        {message ? <span className="muted">{message}</span> : null}
      </div>

      {items.length ? (
        <div className="gallery selectable-gallery">
          {items.map((item) => (
            <label key={item.id} className={selectedIds.includes(item.id) ? 'media-tile selected' : 'media-tile'}>
              <input type="checkbox" checked={selectedIds.includes(item.id)} onChange={() => toggle(item.id)} />
              {item.imageUrl ? <img src={item.imageUrl} alt={item.originalName ?? 'Place image'} /> : <div className="placeholder">Không có ảnh</div>}
            </label>
          ))}
        </div>
      ) : (
        <div className="card muted">Chưa có ảnh cho quán này.</div>
      )}

      <div className="card page">
        <h3>Thêm ảnh</h3>
        <div className="filters">
          <label className="field">
            <span>Upload file ảnh</span>
            <input type="file" accept="image/*" onChange={(event) => setFile(event.target.files?.[0] ?? null)} />
          </label>
          <button type="button" onClick={uploadFile} disabled={!file}>Upload vào quán</button>
        </div>
      </div>
    </div>
  );
}
