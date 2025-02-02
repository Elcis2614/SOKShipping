// client/src/components/common/star-rating.jsx 

import { StarIcon } from "lucide-react";
import { Button } from "../ui/button";
import PropTypes from 'prop-types';

function StarRatingComponent({ rating = 0, handleRatingChange, readonly = false }) {
  console.log(rating, "rating");

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Button
          key={star}
          className={`p-2 rounded-full transition-colors ${
            star <= rating
              ? "text-yellow-500 hover:bg-gray-100"
              : "text-gray-300 hover:bg-gray-100"
          }`}
          variant="ghost"
          size="icon"
          type="button"
          disabled={readonly}
          onClick={handleRatingChange ? () => handleRatingChange(star) : undefined}
        >
          <StarIcon
            className={`w-6 h-6 ${
              star <= rating ? "fill-yellow-500" : "fill-gray-300"
            }`}
          />
        </Button>
      ))}
    </div>
    
  );
}

StarRatingComponent.propTypes = {
  rating: PropTypes.number,
  handleRatingChange: PropTypes.func,  // Function to handle rating changes
  readonly: PropTypes.bool  // Indicates if the component is read-only
};

export default StarRatingComponent;