import React from 'react';
import ItemCard from './ItemCard';
import LoadingSpinner from './LoadingSpinner';
import EmptyState from './EmptyState';

export default function ItemGrid({
  items = [],
  isLoading = false,
  emptyTitle,
  emptyDescription,
  onResetFilters
}) {
  if (isLoading) {
    return <LoadingSpinner message="Fetching items..." />;
  }

  if (!items || items.length === 0) {
    return (
      <EmptyState
        title={emptyTitle || 'No items to display'}
        description={emptyDescription || 'No items match your criteria. Try changing your filters or searching with a different term.'}
        actionText={onResetFilters ? 'Reset Filters' : undefined}
        onAction={onResetFilters}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
      {items.map((item) => (
        <ItemCard key={item.id} item={item} />
      ))}
    </div>
  );
}
