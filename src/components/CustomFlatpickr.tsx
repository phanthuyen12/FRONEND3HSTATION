import Flatpickr from 'react-flatpickr';
import "flatpickr/dist/themes/material_blue.css";

interface FlatpickrProps {
  className?: string;
  value?: Date | Date[] | number | [Date, Date];
  options?: any;
  placeholder?: string;
  onChange?: (date: Date[]) => void;
}

const CustomFlatpickr = ({ className, value, options, placeholder, onChange }: FlatpickrProps) => {
  return (
    <>
      <Flatpickr
        className={className}
        data-enable-time
        value={value}
        options={options}
        placeholder={placeholder}
        onChange={onChange}
      />
    </>
  )
}

export default CustomFlatpickr;