// app/skills/update/[id]/page.tsx
"use client";

import type { FC, JSX, FormEvent, ChangeEvent } from 'react';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAxios } from '@/app/hooks/useAxios';
import type { Skill, GetMySkillsResponse, UpdateSkillPayload } from '@/app/types/skills';

const EditSkillPage: FC = (): JSX.Element => {
  const router = useRouter();
  const { id } = useParams() as { id: string };
  const axios = useAxios();

  const [form, setForm] = useState<Skill>({
    id: 0,
    accountId: 0,
    category: 'GARDENING',
    experienceYears: 0,
    workNature: 'ONSITE',
    hourlyRate: 0,
    currency: 'USD',
  });
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (!id) return;
    axios.get<GetMySkillsResponse>('/skills/my')
      .then(res => {
        const skill = res.data.skills.find(s => s.id === parseInt(id, 10));
        if (skill) setForm(skill);
        else setError('Skill not found');
      })
      .catch(() => setError('Failed to load skill'));
  }, [id, axios]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]:
        name === 'experienceYears' ? parseInt(value, 10) :
        name === 'hourlyRate'     ? parseFloat(value)   :
        value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setError('');
    const payload: UpdateSkillPayload = {
      category: form.category,
      experienceYears: form.experienceYears,
      workNature: form.workNature,
      hourlyRate: form.hourlyRate,
      currency: form.currency,
    };
    try {
      await axios.patch(`/skills/${id}`, payload);
      router.push('/skills/my');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Update failed');
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-50 p-6">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            Edit Skill #{id}
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                id="category"
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="GARDENING">Gardening</option>
                <option value="CLEANING">Cleaning</option>
                <option value="TUTORING">Tutoring</option>
              </select>
            </div>

            <div>
              <label htmlFor="experienceYears" className="block text-sm font-medium text-gray-700 mb-1">
                Experience (Years)
              </label>
              <input
                id="experienceYears"
                name="experienceYears"
                type="number"
                value={form.experienceYears}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="workNature" className="block text-sm font-medium text-gray-700 mb-1">
                Nature of Work
              </label>
              <select
                id="workNature"
                name="workNature"
                value={form.workNature}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="ONSITE">Onsite</option>
                <option value="ONLINE">Online</option>
              </select>
            </div>

            <div>
              <label htmlFor="hourlyRate" className="block text-sm font-medium text-gray-700 mb-1">
                Hourly Rate
              </label>
              <input
                id="hourlyRate"
                name="hourlyRate"
                type="number"
                step="0.01"
                value={form.hourlyRate}
                onChange={handleChange}
                required
                className="w-full px-4 py-3	border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-1">
                Currency
              </label>
              <select
                id="currency"
                name="currency"
                value={form.currency}
                onChange={handleChange}
                className="w-full px-4 py-3	border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="USD">USD</option>
                <option value="AUD">AUD</option>
                <option value="SGD">SGD</option>
                <option value="INR">INR</option>
              </select>
            </div>

            {error && (
              <p className="text-sm text-red-500 text-center">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
            >
              Save Changes
            </button>
          </form>
        </div>
      </div>
    </main>
  );
};

export default EditSkillPage;
