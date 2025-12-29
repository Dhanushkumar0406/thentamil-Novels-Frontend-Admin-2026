import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { adminApi, UpdateChapterPayload } from '../../../api';
import styles from '../NovelManagement/NovelManagement.module.scss';

interface ChapterEditFormData {
  chapterNumber: number;
  title: string;
  content: string;
}

interface FormErrors {
  title?: string;
  content?: string;
  [key: string]: string | undefined;
}

const ChapterEdit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [formData, setFormData] = useState<ChapterEditFormData>({
    chapterNumber: 1,
    title: '',
    content: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    fetchChapter();
  }, [id]);

  const fetchChapter = async () => {
    if (!id) {
      alert('Invalid chapter ID');
      navigate('/admin/chapters');
      return;
    }

    try {
      setLoading(true);

      const chapter = await adminApi.chapters.getById(id);

      setFormData({
        chapterNumber: chapter.chapterNumber,
        title: chapter.title,
        content: chapter.content
      });

    } catch (err: unknown) {
      const errorMessage = err && typeof err === 'object' && 'message' in err
        ? String(err.message)
        : 'Error loading chapter';
      console.error('Fetch error:', err);
      alert(errorMessage);
      navigate('/admin/chapters');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const finalValue = name === 'chapterNumber' ? parseInt(value) || 0 : value;
    setFormData(prev => ({ ...prev, [name]: finalValue }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: undefined }));
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title required';
    if (!formData.content.trim()) newErrors.content = 'Content required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || !id) return;

    try {
      setSaving(true);

      const payload: UpdateChapterPayload = {
        title: formData.title,
        content: formData.content,
        chapterNumber: formData.chapterNumber
      };

      await adminApi.chapters.update(id, payload);

      alert('Chapter updated successfully!');
      navigate('/admin/chapters');

    } catch (err: unknown) {
      const errorMessage = err && typeof err === 'object' && 'message' in err
        ? String(err.message)
        : 'Failed to update chapter';
      console.error('Update error:', err);
      alert(errorMessage);
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
              <input type="number" name="chapterNumber" value={formData.chapterNumber} onChange={handleChange} className={styles.input} min="1" placeholder="Enter chapter number" />
            </div>

            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label className={styles.label}>
                Title <span className={styles.required}>*</span>
              </label>
              <input type="text" name="title" value={formData.title} onChange={handleChange} className={styles.input} placeholder="e.g., வெள்ளம்" />
              {errors.title && <p className={styles.errorText}>{errors.title}</p>}
            </div>

            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label className={styles.label}>
                Content <span className={styles.required}>*</span>
              </label>
              <textarea name="content" value={formData.content} onChange={handleChange} className={styles.textarea} rows={15} placeholder="Enter chapter content..." />
              {errors.content && <p className={styles.errorText}>{errors.content}</p>}
              <p className={styles.helpText}>Note: For production, integrate a rich text editor</p>
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
