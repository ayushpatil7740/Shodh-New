export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
};

export const formatDateTime = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);
};

export const timeAgo = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);

  if (seconds < 60) return 'Just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.floor(months / 12)}y ago`;
};

export const resolveImageUrl = (url) => {
  if (!url) return null;
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  // In development Vite proxy handles /uploads, or fallback to backend
  return url;
};

export const getCategoryGradient = (category) => {
  switch (category) {
    case 'Electronics':
      return 'from-blue-500 to-indigo-600';
    case 'Documents & IDs':
      return 'from-amber-500 to-orange-600';
    case 'Wallets & Bags':
      return 'from-emerald-500 to-teal-600';
    case 'Keys':
      return 'from-violet-500 to-purple-600';
    case 'Clothing & Accessories':
      return 'from-pink-500 to-rose-600';
    case 'Books & Stationery':
      return 'from-cyan-500 to-blue-600';
    case 'Jewelry & Watches':
      return 'from-yellow-500 to-amber-600';
    default:
      return 'from-slate-500 to-slate-700';
  }
};
