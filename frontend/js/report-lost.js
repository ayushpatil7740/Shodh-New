/**
 * Report Lost Item Page Logic
 * Handles image preview, client validation, form submission, and matches modal
 */
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('report-lost-form');
  const fileInput = document.getElementById('photo-input');
  const uploaderBox = document.getElementById('uploader-box');
  const previewContainer = document.getElementById('preview-container');
  const previewImg = document.getElementById('preview-img');
  const removePhotoBtn = document.getElementById('remove-photo-btn');
  const submitBtn = document.getElementById('submit-btn');
  const alertBox = document.getElementById('form-alert');

  const successModal = document.getElementById('success-modal');
  const matchesList = document.getElementById('modal-matches-list');
  const noMatchesNotice = document.getElementById('modal-no-matches');
  const viewItemBtn = document.getElementById('modal-view-item-btn');

  let selectedFile = null;

  // File Picker Click
  if (uploaderBox && fileInput) {
    uploaderBox.addEventListener('click', () => fileInput.click());

    // Drag and drop
    uploaderBox.addEventListener('dragover', (e) => e.preventDefault());
    uploaderBox.addEventListener('drop', (e) => {
      e.preventDefault();
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleFileSelection(e.dataTransfer.files[0]);
      }
    });

    fileInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files[0]) {
        handleFileSelection(e.target.files[0]);
      }
    });
  }

  function handleFileSelection(file) {
    showAlert('');
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      showAlert('Invalid file format. Please upload JPG, PNG, or WebP.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showAlert('File exceeds 5MB limit. Please choose a smaller photo.');
      return;
    }

    selectedFile = file;
    const url = URL.createObjectURL(file);
    previewImg.src = url;
    previewContainer.style.display = 'block';
    uploaderBox.style.display = 'none';
  }

  if (removePhotoBtn) {
    removePhotoBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      selectedFile = null;
      previewImg.src = '';
      previewContainer.style.display = 'none';
      uploaderBox.style.display = 'block';
      fileInput.value = '';
    });
  }

  function showAlert(msg) {
    if (!alertBox) return;
    if (!msg) {
      alertBox.style.display = 'none';
      alertBox.textContent = '';
    } else {
      alertBox.style.display = 'block';
      alertBox.textContent = msg;
    }
  }

  // Handle Form Submit
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      showAlert('');

      const itemName = document.getElementById('item-name').value.trim();
      const category = document.getElementById('category').value;
      const location = document.getElementById('location').value.trim();
      const date = document.getElementById('date').value;
      const time = document.getElementById('time').value.trim();
      const description = document.getElementById('description').value.trim();
      const contactName = document.getElementById('contact-name').value.trim();
      const contactEmail = document.getElementById('contact-email').value.trim();
      const contactPhone = document.getElementById('contact-phone').value.trim();
      const additionalInfo = document.getElementById('additional-info').value.trim();

      if (!itemName || !category || !location || !date || !description || !contactName) {
        showAlert('Please fill in all required fields marked with an asterisk (*).');
        return;
      }

      if (!contactEmail && !contactPhone) {
        showAlert('Please provide at least a contact phone number or email address.');
        return;
      }

      submitBtn.disabled = true;
      submitBtn.textContent = 'Submitting & Processing...';

      try {
        const formData = new FormData();
        formData.append('type', 'lost');
        formData.append('itemName', itemName);
        formData.append('category', category);
        formData.append('location', location);
        formData.append('date', date);
        formData.append('time', time);
        formData.append('description', description);
        formData.append('contactName', contactName);
        formData.append('contactEmail', contactEmail);
        formData.append('contactPhone', contactPhone);
        formData.append('additionalInfo', additionalInfo);

        if (selectedFile) {
          formData.append('photo', selectedFile);
        }

        const res = await fetch(`${API_BASE_URL}/items/lost`, {
          method: 'POST',
          body: formData
        });

        const data = await res.json();

        if (!res.ok || !data.success) {
          showAlert(data.message || 'Error submitting report. Please try again.');
          submitBtn.disabled = false;
          submitBtn.textContent = 'Report Lost Item';
          return;
        }

        // Show Success & Matches Modal
        form.reset();
        if (removePhotoBtn) removePhotoBtn.click();

        const matches = data.matches || [];
        if (matches.length > 0) {
          matchesList.innerHTML = matches.map(m => renderMatchCard(m, '..')).join('');
          matchesList.style.display = 'block';
          noMatchesNotice.style.display = 'none';
        } else {
          matchesList.innerHTML = '';
          matchesList.style.display = 'none';
          noMatchesNotice.style.display = 'block';
        }

        if (viewItemBtn && data.data) {
          viewItemBtn.href = `../item-details/index.html?id=${encodeURIComponent(data.data.id)}`;
        }

        successModal.style.display = 'flex';
      } catch (err) {
        console.error('Submission error:', err);
        showAlert('Network or server error. Make sure the backend server is running on port 5000.');
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Report Lost Item';
      }
    });
  }

  // Modal dismiss button
  const closeModalBtn = document.getElementById('modal-close-btn');
  if (closeModalBtn && successModal) {
    closeModalBtn.addEventListener('click', () => {
      successModal.style.display = 'none';
    });
  }
});
