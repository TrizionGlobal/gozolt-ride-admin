import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatStatusLabel(status: string | null | undefined): string {
  if (!status) return 'Unknown';
  return status
    .replace(/_/g, ' ')
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

export function parseCleanDate(value: string | Date | null | undefined): Date | null {
  if (!value) return null;
  const clean = typeof value === 'string' ? value.replace('Z', '') : value;
  const d = new Date(clean);
  return isNaN(d.getTime()) ? null : d;
}

export function formatDate(value: string | Date | null | undefined): string {
  const d = parseCleanDate(value);
  if (!d) return 'N/A';
  const day = d.getDate().toString().padStart(2, '0');
  const month = d.toLocaleString('en-GB', { month: 'short' });
  const year = d.getFullYear();
  return `${day} ${month} ${year}`;
}

export function formatTime(value: string | Date | null | undefined): string {
  const d = parseCleanDate(value);
  if (!d) return 'N/A';
  let hours = d.getHours();
  const minutes = d.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12;
  return `${hours}:${minutes} ${ampm}`;
}

export function formatDateTime(value: string | Date | null | undefined): string {
  const d = parseCleanDate(value);
  if (!d) return 'N/A';
  return `${formatDate(d)}, ${formatTime(d)}`;
}
