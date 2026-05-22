import { redirect } from 'next/navigation';
import { getAccessToken, getCurrentUser } from '../../../lib/auth';

export default async function NewPlacePage() {
  const user = await getCurrentUser();
  const token = await getAccessToken();
  if (!user || !token) redirect('/login');

  async function createPlace(formData: FormData) {
    'use server';
    const currentToken = await getAccessToken();
    if (!currentToken) redirect('/login');

    const response = await fetch(`${process.env.API_BASE_URL ?? 'http://localhost:3000/api/v1'}/places`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${currentToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: String(formData.get('name') ?? ''),
        categoryId: Number(formData.get('categoryId') ?? 0),
        address: String(formData.get('address') ?? '') || null,
        district: String(formData.get('district') ?? '') || null,
        city: String(formData.get('city') ?? '') || null,
        serviceType: String(formData.get('serviceType') ?? '') || null,
        mealType: String(formData.get('mealType') ?? '') || null,
        priceText: String(formData.get('priceText') ?? '') || null,
        isActive: true
      })
    });

    if (!response.ok) throw new Error('Create place failed');
    const place = (await response.json()) as { id: number };
    redirect(`/places/${place.id}`);
  }

  return (
    <section className="page">
      <div>
        <h1>Thêm quán ăn</h1>
        <p className="muted">Staff và admin đều có thể thêm thông tin quán ăn.</p>
      </div>
      <form className="form-card card page" action={createPlace}>
        <div className="form-grid">
          <Field name="name" label="Tên quán" required />
          <Field name="categoryId" label="Category ID" required />
          <Field name="address" label="Địa chỉ" />
          <Field name="district" label="Quận/Huyện" />
          <Field name="city" label="Thành phố" defaultValue="Đà Lạt" />
          <Field name="serviceType" label="Loại dịch vụ" />
          <Field name="mealType" label="Meal type" />
          <Field name="priceText" label="Giá" />
        </div>
        <button type="submit">Tạo quán</button>
      </form>
    </section>
  );
}

function Field(props: { name: string; label: string; required?: boolean; defaultValue?: string }) {
  return <label className="field"><span>{props.label}</span><input name={props.name} required={props.required} defaultValue={props.defaultValue ?? ''} /></label>;
}
