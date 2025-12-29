import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { adminApi, CreateChapterPayload, Novel } from '../../../api';
import styles from '../NovelManagement/NovelManagement.module.scss';

interface ChapterFormData {
  novelId: string;
  chapterNumber: number;
  title: string;
  content: string;
}

interface FormErrors {
  novelId?: string;
  chapterNumber?: string;
  title?: string;
  content?: string;
  [key: string]: string | undefined;
}

interface NovelData extends Novel {
  [key: string]: unknown;
}

const ChapterCreate = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const novelIdParam = searchParams.get('novelId');

  const [novels, setNovels] = useState<NovelData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<ChapterFormData>({
    novelId: novelIdParam || '',
    chapterNumber: 1,
    title: '',
    content: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    fetchNovels();
  }, []);

  const fetchNovels = async () => {
    try {
      const response = await adminApi.novels.getAll({ page: 1, limit: 100 });
      setNovels(response.items as NovelData[]);
    } catch (err: unknown) {
      console.error('Fetch novels error:', err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    // Convert chapterNumber to number
    const finalValue = name === 'chapterNumber' ? parseInt(value) || 0 : value;
    setFormData(prev => ({ ...prev, [name]: finalValue }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: undefined }));
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.novelId) newErrors.novelId = 'Select a novel';
    if (!formData.chapterNumber) newErrors.chapterNumber = 'Chapter number required';
    if (!formData.title.trim()) newErrors.title = 'Title required';
    if (!formData.content.trim()) newErrors.content = 'Content required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setLoading(true);

      const payload: CreateChapterPayload = {
        novelId: formData.novelId,
        title: formData.title,
        content: formData.content,
        chapterNumber: formData.chapterNumber
      };

      await adminApi.chapters.create(payload);

      alert('Chapter created successfully!');
      navigate(`/admin/chapters?novelId=${formData.novelId}`);

    } catch (err: unknown) {
      const errorMessage = err && typeof err === 'object' && 'message' in err
        ? String(err.message)
        : 'Failed to create chapter';
      console.error('Create error:', err);
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Create New Chapter</h1>
          <p className={styles.subtitle}>Add a new chapter to a novel</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className={styles.formCard}>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label className={styles.label}>
                Novel <span className={styles.required}>*</span>
              </label>
              <select name="novelId" value={formData.novelId} onChange={handleChange} className={styles.select} aria-label="Select novel">
                <option value="">Select novel...</option>
                {novels.map(n => <option key={n.id} value={n.id}>{n.title}</option>)}
              </select>
              {errors.novelId && <p className={styles.errorText}>{errors.novelId}</p>}
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>
                Chapter Number <span className={styles.required}>*</span>
              </label>
              <input type="number" name="chapterNumber" value={formData.chapterNumber} onChange={handleChange} className={styles.input} min="1" placeholder="Enter chapter number" />
              {errors.chapterNumber && <p className={styles.errorText}>{errors.chapterNumber}</p>}
            </div>

            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label className={styles.label}>
                Title <span className={styles.required}>*</span>
              </label>
              <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="e.g., வெள்ளம்" className={styles.input} />
              {errors.title && <p className={styles.errorText}>{errors.title}</p>}
            </div>

            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label className={styles.label}>
                Content <span className={styles.required}>*</span>
              </label>
              <textarea name="content" value={formData.content} onChange={handleChange} placeholder="Enter chapter content..." className={styles.textarea} rows={15} />
              {errors.content && <p className={styles.errorText}>{errors.content}</p>}
              <p className={styles.helpText}>Note: For production, integrate a rich text editor</p>
            </div>
          </div>

          <div className={styles.formActions}>
            <button type="button" onClick={() => navigate('/admin/chapters')} className={styles.cancelButton} disabled={loading}>Cancel</button>
            <button type="submit" className={styles.submitButton} disabled={loading}>{loading ? 'Creating...' : 'Create Chapter'}</button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ChapterCreate;
