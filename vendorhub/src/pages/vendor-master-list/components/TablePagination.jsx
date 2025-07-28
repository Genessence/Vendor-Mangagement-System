import React from 'react';

import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const TablePagination = ({ 
  currentPage, 
  totalPages, 
  totalItems, 
  itemsPerPage, 
  onPageChange, 
  onItemsPerPageChange 
}) => {
  const pageSizeOptions = [
    { value: '10', label: '10 per page' },
    { value: '25', label: '25 per page' },
    { value: '50', label: '50 per page' },
    { value: '100', label: '100 per page' }
  ];

  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, currentPage - delta); 
         i <= Math.min(totalPages - 1, currentPage + delta); 
         i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  if (totalItems === 0) {
    return (
      <div className="bg-surface border border-border rounded-lg p-4 text-center">
        <div className="text-text-secondary">No vendors found</div>
      </div>
    );
  }

  return (
    <div className="bg-surface border border-border rounded-lg p-4">
      <div className="flex flex-col lg:flex-row items-center justify-between space-y-4 lg:space-y-0">
        {/* Items Info */}
        <div className="flex items-center space-x-4">
          <span className="text-sm text-text-secondary">
            Showing {startItem.toLocaleString('en-IN')} to {endItem.toLocaleString('en-IN')} of {totalItems.toLocaleString('en-IN')} vendors
          </span>
          
          {/* Page Size Selector */}
          <div className="flex items-center space-x-2">
            <Select
              options={pageSizeOptions}
              value={itemsPerPage.toString()}
              onChange={(value) => onItemsPerPageChange(parseInt(value))}
              className="w-32"
            />
          </div>
        </div>

        {/* Pagination Controls */}
        <div className="flex items-center space-x-2">
          {/* Previous Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            iconName="ChevronLeft"
            iconSize={16}
          >
            Previous
          </Button>

          {/* Page Numbers */}
          <div className="hidden sm:flex items-center space-x-1">
            {getVisiblePages().map((page, index) => (
              <React.Fragment key={index}>
                {page === '...' ? (
                  <span className="px-3 py-2 text-text-secondary">...</span>
                ) : (
                  <Button
                    variant={currentPage === page ? "default" : "ghost"}
                    size="sm"
                    onClick={() => onPageChange(page)}
                    className="min-w-[40px]"
                  >
                    {page}
                  </Button>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Mobile Page Info */}
          <div className="sm:hidden flex items-center space-x-2">
            <span className="text-sm text-text-secondary">
              Page {currentPage} of {totalPages}
            </span>
          </div>

          {/* Next Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            iconName="ChevronRight"
            iconPosition="right"
            iconSize={16}
          >
            Next
          </Button>
        </div>
      </div>

      {/* Mobile Pagination */}
      <div className="sm:hidden mt-4 pt-4 border-t border-border">
        <div className="flex items-center justify-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}
            iconName="ChevronsLeft"
            iconSize={16}
          >
            First
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            iconName="ChevronLeft"
            iconSize={16}
          >
            Prev
          </Button>

          <div className="flex items-center space-x-1">
            {[...Array(Math.min(5, totalPages))].map((_, index) => {
              const pageNum = Math.max(1, currentPage - 2) + index;
              if (pageNum > totalPages) return null;
              
              return (
                <Button
                  key={pageNum}
                  variant={currentPage === pageNum ? "default" : "ghost"}
                  size="sm"
                  onClick={() => onPageChange(pageNum)}
                  className="min-w-[40px]"
                >
                  {pageNum}
                </Button>
              );
            })}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            iconName="ChevronRight"
            iconSize={16}
          >
            Next
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage === totalPages}
            iconName="ChevronsRight"
            iconSize={16}
          >
            Last
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TablePagination;