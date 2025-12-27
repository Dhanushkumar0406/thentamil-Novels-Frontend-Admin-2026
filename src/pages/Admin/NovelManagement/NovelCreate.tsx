import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createNovel, AVAILABLE_CATEGORIES, NOVEL_STATUS } from '../../../services/API/adminMockService';
import styles from './NovelManagement.module.scss';

/**
 * NovelCreate Component
 * Form for creating a new novel
 *
 * INTEGRATION: Replace createNovel() with real API call
 */

interface NovelFormData {
  title: string;
  author_name: string;
  categories: string[];
  novel_summary: string;
  status: string;
  cover_image: string;
}

interface FormErrors {
  title?: string;
  author_name?: string;
  categories?: string;
  novel_summary?: string;
  [key: string]: string | undefined;
}

const NovelCreate = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<NovelFormData>({
    title: '',
    author_name: '',
    categories: [],
    novel_summary: '',
    status: 'Draft',
    cover_image: ''
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

  const toggleCategory = (category: string) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }));
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
      setFormData(prev => ({ ...prev, cover_image: result }));
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
    setFormData(prev => ({ ...prev, cover_image: '' }));
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.author_name.trim()) newErrors.author_name = 'Author name is required';
    if (formData.categories.length === 0) newErrors.categories = 'Select at least one category';
    if (!formData.novel_summary.trim()) newErrors.novel_summary = 'Summary is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setLoading(true);
      // TODO: Replace with real API call
      const response = await createNovel(formData);

      if (response.success) {
        alert('Novel created successfully!');
        navigate('/admin/novels');
      } else {
        alert('Failed to create novel: ' + (response.error || 'Unknown error'));
      }
    } catch (err) {
      console.error('Create novel error:', err);
      alert('An error occurred while creating the novel');
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
                name="author_name"
                value={formData.author_name}
                onChange={handleChange}
                placeholder="Enter author name"
                className={`${styles.input} ${errors.author_name ? styles.error : ''}`}
              />
              {errors.author_name && <p className={styles.errorText}>{errors.author_name}</p>}
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
                  <button
                    type="button"
                    className={styles.uploadButton}
                    onClick={() => document.getElementById('coverImageInput')?.click()}
                  >
                    📤 Choose File
                  </button>
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

            {/* Categories */}
            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label className={styles.label}>
                Categories <span className={styles.required}>*</span>
              </label>
              <div className={styles.categorySelector}>
                {AVAILABLE_CATEGORIES.map(category => (
                  <div
                    key={category}
                    className={`${styles.categoryOption} ${
                      formData.categories.includes(category) ? styles.selected : ''
                    }`}
                    onClick={() => toggleCategory(category)}
                  >
                    {category}
                  </div>
                ))}
              </div>
              {errors.categories && <p className={styles.errorText}>{errors.categories}</p>}
              <p className={styles.helpText}>
                Selected: {formData.categories.length > 0 ? formData.categories.join(', ') : 'None'}
              </p>
            </div>

            {/* Summary */}
            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label className={styles.label}>
                Novel Summary <span className={styles.required}>*</span>
              </label>
              <textarea
                name="novel_summary"
                value={formData.novel_summary}
                onChange={handleChange}
                placeholder="Enter a brief summary of the novel"
                className={`${styles.textarea} ${errors.novel_summary ? styles.error : ''}`}
              />
              {errors.novel_summary && <p className={styles.errorText}>{errors.novel_summary}</p>}
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
