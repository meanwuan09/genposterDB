import Link from 'next/link';
import { redirect } from 'next/navigation';
import { PlaceDetailForm } from '../../../components/places/PlaceDetailForm';
import { PlaceImageGallery } from '../../../components/places/PlaceImageGallery';
import { PlacePartnerForm } from '../../../components/places/PlacePartnerForm';
import { apiGet } from '../../../lib/api';
import { getAccessToken, getCurrentUser } from '../../../lib/auth';
import type { PlaceDetail, UserSummary } from '../../../lib/types';

function formatDate(value: string | null) {
  return value ? new Date(value).toLocaleString('vi-VN') : '—';
}

function userLabel(user: UserSummary | null) {
  return user?.name ?? user?.email ?? '—';
}

export default async function PlaceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  const token = await getAccessToken();
  if (!user || !token) redirect('/login');

  const { id } = await params;
  const place = await apiGet<PlaceDetail>(`/places/${id}`);

  return (
    <section className="page">
      <div className="header">
        <div>
          <h1>{place.name}</h1>
          <p className="muted">#{place.id} · {place.categoryName ?? `Category ${place.categoryId}`}</p>
        </div>
        <div className="actions">
          <Link className="button secondary" href="/places">Quay lại</Link>
          <span className={place.isActive ? 'badge' : 'badge off'}>{place.isActive ? 'ACTIVE' : 'INACTIVE'}</span>
        </div>
      </div>
      <div className="card form-grid">
        <div><strong>Created by</strong><div className="muted">{userLabel(place.createdBy)}</div></div>
        <div><strong>Created at</strong><div className="muted">{formatDate(place.createdAt)}</div></div>
        <div><strong>Updated by</strong><div className="muted">{userLabel(place.updatedBy)}</div></div>
        <div><strong>Updated at</strong><div className="muted">{formatDate(place.updatedAt)}</div></div>
      </div>
      <div className="card page">
        <h2>Ảnh</h2>
        <PlaceImageGallery placeId={place.id} media={place.media} token={token} />
      </div>
      <PlaceDetailForm place={place} token={token} />
      <PlacePartnerForm place={place} token={token} role={user.role} />
    </section>
  );
}
