import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getChapterById, updateChapter, CHAPTER_TYPES, CHAPTER_STATUS } from '../../../services/API/adminMockService';
import styles from '../NovelManagement/NovelManagement.module.scss';

interface ChapterEditFormData {
  chapter_number: number;
  name: string;
  title: string;
  chapter_type: string;
  thumbnail: string;
  content: string;
  status: string;
}

interface FormErrors {
  name?: string;
  title?: string;
  [key: string]: string | undefined;
}

const ChapterEdit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [formData, setFormData] = useState<ChapterEditFormData>({
    chapter_number: 1,
    name: '',
    title: '',
    chapter_type: 'Regular',
    thumbnail: '',
    content: '',
    status: 'Draft'
  });
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    fetchChapter();
  }, [id]);

  const fetchChapter = async () => {
    try {
      const response = await getChapterById(id);
      if (response.success && response.data) {
        const c = response.data;
        setFormData({
          chapter_number: c.chapter_number,
          name: c.name,
          title: c.title,
          chapter_type: c.chapter_type,
          thumbnail: c.thumbnail || '',
          content: c.content || '',
          status: c.status
        });
      } else {
        alert('Chapter not found');
        navigate('/admin/chapters');
      }
    } catch (err) {
      console.error('Fetch error:', err);
      alert('Error loading chapter');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: undefined }));
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name required';
    if (!formData.title.trim()) newErrors.title = 'Title required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setSaving(true);
      const response = await updateChapter(id, formData);
      if (response.success) {
        alert('Chapter updated!');
        navigate('/admin/chapters');
      } else {
        alert('Failed to update');
      }
    } catch (err) {
      console.error('Update error:', err);
      alert('Error updating chapter');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <p>Loading chapter...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Edit Chapter</h1>
          <p className={styles.subtitle}>Update chapter information</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className={styles.formCard}>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Chapter Number</label>
              <input type="number" name="chapter_number" value={formData.chapter_number} onChange={handleChange} className={styles.input} min="1" placeholder="Enter chapter number" />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>
                Name <span className={styles.required}>*</span>
              </label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} className={styles.input} placeholder="e.g., முதல் அத்தியாயம்" />
              {errors.name && <p className={styles.errorText}>{errors.name}</p>}
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>
                Title <span className={styles.required}>*</span>
              </label>
              <input type="text" name="title" value={formData.title} onChange={handleChange} className={styles.input} placeholder="e.g., வெள்ளம்" />
              {errors.title && <p className={styles.errorText}>{errors.title}</p>}
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Type</label>
              <select name="chapter_type" value={formData.chapter_type} onChange={handleChange} className={styles.select} aria-label="Select chapter type">
                {CHAPTER_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Status</label>
              <select name="status" value={formData.status} onChange={handleChange} className={styles.select} aria-label="Select status">
                {CHAPTER_STATUS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label className={styles.label}>Thumbnail URL</label>
              <input type="text" name="thumbnail" value={formData.thumbnail} onChange={handleChange} className={styles.input} placeholder="Enter thumbnail URL" />
            </div>

            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label className={styles.label}>Content</label>
              <textarea name="content" value={formData.content} onChange={handleChange} className={styles.textarea} rows={10} placeholder="Enter chapter content" />
            </div>
          </div>

          <div className={styles.formActions}>
            <button type="button" onClick={() => navigate('/admin/chapters')} className={styles.cancelButton} disabled={saving}>Cancel</button>
            <button type="submit" className={styles.submitButton} disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ChapterEdit;
