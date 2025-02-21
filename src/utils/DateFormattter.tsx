export default function formatDateToLongForm(dateString: any) {
  const options: any = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric', 
  };
  
  const date = new Date(dateString);
  
  // Format the date part
  const formattedDate = date.toLocaleDateString(undefined, options);
  
  // Format the time part
  const formattedTime = date.toLocaleTimeString(undefined, {
    hour: '2-digit', 
    minute: '2-digit', 
    hour12: false, // 24-hour format
  });
  
  // Combine date and time with "at"
  return `${formattedDate} at ${formattedTime}`;
}



