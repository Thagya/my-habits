/**
 * Format a Date object to YYYY-MM-DD string
 * Handles invalid dates and ensures consistent formatting
 */
export const formatDate = (date: Date): string => {
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    console.warn('Invalid date provided to formatDate');
    return formatDate(new Date()); // Return today's date as fallback
  }
  
  // Use UTC methods to avoid timezone issues
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Check if a date string is today
 * Compares only the date part, ignoring time
 */
export const isToday = (dateString: string): boolean => {
  try {
    // Get today's date with time set to midnight
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Parse the input date and set time to midnight
    const inputDate = new Date(dateString);
    inputDate.setHours(0, 0, 0, 0);
    
    // Compare the dates
    return today.getTime() === inputDate.getTime();
  } catch (error) {
    console.warn('Error in isToday:', error);
    return false;
  }
};

/**
 * Check if a date string is within the current week
 * Uses local time and considers Sunday as the first day of the week
 */
export const isThisWeek = (dateString: string): boolean => {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return false;
    }
    
    const now = new Date();
    
    // Get the first day of the week (Sunday)
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    
    // Get the last day of the week (Saturday)
    const endOfWeek = new Date(now);
    endOfWeek.setDate(now.getDate() + (6 - now.getDay()));
    endOfWeek.setHours(23, 59, 59, 999);
    
    // Normalize the date for comparison
    date.setHours(12, 0, 0, 0);
    
    return date >= startOfWeek && date <= endOfWeek;
  } catch (error) {
    console.warn('Error in isThisWeek:', error);
    return false;
  }
};

/**
 * Get the number of days in a month
 * Correctly handles leap years and edge cases
 */
export const getDaysInMonth = (month: number, year: number): number => {
  // Validate inputs
  if (month < 0 || month > 11) {
    console.warn('Invalid month provided to getDaysInMonth:', month);
    return 30; // Default fallback
  }
  
  if (year < 1900 || year > 2100) {
    console.warn('Year may be out of reasonable range:', year);
    // Continue anyway as the Date object will handle it
  }
  
  // This correctly handles leap years and different month lengths
  return new Date(year, month + 1, 0).getDate();
};

/**
 * Check if two dates are consecutive days
 * Handles month/year boundaries and DST changes
 */
export const areDatesConsecutive = (date1: string, date2: string): boolean => {
  try {
    // Parse the dates
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    
    // Check if dates are valid
    if (isNaN(d1.getTime()) || isNaN(d2.getTime())) {
      return false;
    }
    
    // Normalize dates to noon to avoid DST issues
    d1.setHours(12, 0, 0, 0);
    d2.setHours(12, 0, 0, 0);
    
    // Calculate the difference in days
    const diffTime = Math.abs(d2.getTime() - d1.getTime());
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays === 1;
  } catch (error) {
    console.warn('Error in areDatesConsecutive:', error);
    return false;
  }
};

/**
 * Check if a date string is yesterday
 */
export const isYesterday = (dateString: string): boolean => {
  try {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);
    
    const inputDate = new Date(dateString);
    inputDate.setHours(0, 0, 0, 0);
    
    return yesterday.getTime() === inputDate.getTime();
  } catch (error) {
    console.warn('Error in isYesterday:', error);
    return false;
  }
};

/**
 * Get an array of date strings between two dates (inclusive)
 */
export const getDatesBetween = (startDate: string, endDate: string): string[] => {
  try {
    const dates: string[] = [];
    let currentDate = new Date(startDate);
    const end = new Date(endDate);
    
    // Check if dates are valid
    if (isNaN(currentDate.getTime()) || isNaN(end.getTime())) {
      return [];
    }
    
    // Normalize dates to midnight
    currentDate.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);
    
    // Add each date until we reach the end date
    while (currentDate <= end) {
      dates.push(formatDate(new Date(currentDate)));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return dates;
  } catch (error) {
    console.warn('Error in getDatesBetween:', error);
    return [];
  }
};

/**
 * Get the name of a month from its number (0-11)
 */
export const getMonthName = (month: number): string => {
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  if (month < 0 || month > 11) {
    console.warn('Invalid month index:', month);
    return 'Unknown';
  }
  
  return monthNames[month];
};

/**
 * Get the name of a day from a Date object
 */
export const getDayName = (date: Date): string => {
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    console.warn('Invalid date provided to getDayName');
    return 'Unknown';
  }
  
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return dayNames[date.getDay()];
};

/**
 * Get short day name (3 letters)
 */
export const getShortDayName = (date: Date): string => {
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    console.warn('Invalid date provided to getShortDayName');
    return 'Unk';
  }
  
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return dayNames[date.getDay()];
};