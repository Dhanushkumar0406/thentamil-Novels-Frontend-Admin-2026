import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminApi, CreateNovelPayload, NovelStatus } from '../../../api';
import styles from './NovelManagement.module.scss';

const NOVEL_GENRES = ['Romance', 'Fantasy', 'Mystery', 'Thriller', 'Drama', 'Horror', 'Comedy', 'Action', 'SciFi'];
const NOVEL_STATUS: NovelStatus[] = ['ONGOING', 'COMPLETED', 'HIATUS'];

interface NovelFormData {
  title: string;
  author: string;
  genre: string;
  description: string;
  status: NovelStatus;
  coverImage: string;
}

interface FormErrors {
  title?: string;
  author?: string;
  genre?: string;
  description?: string;
  [key: string]: string | undefined;
}

const NovelCreate = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<NovelFormData>({
    title: '',
    author: '',
    genre: '',
    description: '',
    status: 'ONGOING',
    coverImage: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };


  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const processImageFile = (file: File) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setImagePreview(result);
      setFormData(prev => ({ ...prev, coverImage: result }));
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview('');
    setFormData(prev => ({ ...prev, coverImage: '' }));
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.author.trim()) newErrors.author = 'Author name is required';
    if (!formData.genre) newErrors.genre = 'Genre is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setLoading(true);

      const payload: CreateNovelPayload = {
        title: formData.title,
        author: formData.author,
        description: formData.description,
        coverImage: formData.coverImage || 'https://via.placeholder.com/300x400',
        genre: formData.genre,
        status: formData.status
      };

      await adminApi.novels.create(payload);

      alert('Novel created successfully!');
      navigate('/admin/novels');

    } catch (err: unknown) {
      const errorMessage = err && typeof err === 'object' && 'message' in err
        ? String(err.message)
        : 'Failed to create novel';
      console.error('Create novel error:', err);
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Create New Novel</h1>
          <p className={styles.subtitle}>Add a new novel to the platform</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className={styles.formCard}>
          <div className={styles.formGrid}>
            {/* Title */}
            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label className={styles.label}>
                Title <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter novel title"
                className={`${styles.input} ${errors.title ? styles.error : ''}`}
              />
              {errors.title && <p className={styles.errorText}>{errors.title}</p>}
            </div>

            {/* Author */}
            <div className={styles.formGroup}>
              <label className={styles.label}>
                Author Name <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                name="author"
                value={formData.author}
                onChange={handleChange}
                placeholder="Enter author name"
                className={`${styles.input} ${errors.author ? styles.error : ''}`}
              />
              {errors.author && <p className={styles.errorText}>{errors.author}</p>}
            </div>

            {/* Status */}
            <div className={styles.formGroup}>
              <label className={styles.label}>Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className={styles.select}
                aria-label="Select status"
              >
                {NOVEL_STATUS.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>

            {/* Cover Image Upload */}
            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label className={styles.label}>Cover Image</label>

              {!imagePreview ? (
                <div
                  className={`${styles.imageUploadCard} ${isDragging ? styles.dragging : ''}`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <div className={styles.uploadIcon}>📁</div>
                  <p className={styles.uploadText}>
                    {isDragging ? 'Drop image here' : 'Drag and drop your image here'}
                  </p>
                  <p className={styles.uploadHint}>PNG, JPG, GIF up to 5MB</p>
                  <div className={styles.uploadDivider}>
                    <span>or</span>
                  </div>
                  <label
                    htmlFor="coverImageInput"
                    className={styles.uploadButton}
                  >
                    📤 Choose File
                  </label>
                  <input
                    id="coverImageInput"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ display: 'none' }}
                  />
                </div>
              ) : (
                <div className={styles.imagePreviewCard}>
                  <img src={imagePreview} alt="Cover preview" className={styles.previewImage} />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className={styles.removeImageButton}
                  >
                    ✕ Remove
                  </button>
                </div>
              )}

              <p className={styles.helpText}>Optional: Upload a cover image for the novel</p>
            </div>

            {/* Genre */}
            <div className={styles.formGroup}>
              <label className={styles.label}>
                Genre <span className={styles.required}>*</span>
              </label>
              <select
                name="genre"
                value={formData.genre}
                onChange={handleChange}
                className={`${styles.select} ${errors.genre ? styles.error : ''}`}
                aria-label="Select genre"
              >
                <option value="">Select Genre</option>
                {NOVEL_GENRES.map(genre => (
                  <option key={genre} value={genre}>{genre}</option>
                ))}
              </select>
              {errors.genre && <p className={styles.errorText}>{errors.genre}</p>}
            </div>

            {/* Description */}
            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label className={styles.label}>
                Description <span className={styles.required}>*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter a brief description of the novel"
                className={`${styles.textarea} ${errors.description ? styles.error : ''}`}
              />
              {errors.description && <p className={styles.errorText}>{errors.description}</p>}
            </div>
          </div>

          {/* Form Actions */}
          <div className={styles.formActions}>
            <button
              type="button"
              onClick={() => navigate('/admin/novels')}
              className={styles.cancelButton}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Novel'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default NovelCreate;
