import React from 'react';
import type { InvoiceListItem } from '@/services/admin/invoice.types';

interface InvoicePrintTemplateProps {
  invoice: InvoiceListItem | null;
}

export const InvoicePrintTemplate = React.forwardRef<HTMLDivElement, InvoicePrintTemplateProps>(
  ({ invoice }, ref) => {
    if (!invoice) return <div ref={ref} />;

    return (
      <div ref={ref} className="p-10 bg-white text-black min-h-screen">
        <div className="flex justify-between items-start mb-12">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">INVOICE</h1>
            <p className="text-gray-500 font-medium">{invoice.invoiceNumber}</p>
          </div>
          <div className="text-right">
            <h2 className="text-2xl font-bold text-gray-900">Gozolt</h2>
            <p className="text-gray-500 mt-1">123 Admin Street</p>
            <p className="text-gray-500">Business City, 12345</p>
          </div>
        </div>

        <div className="flex justify-between items-start mb-12">
          <div>
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Billed To</h3>
            <p className="font-medium text-gray-900">{invoice.supplierName}</p>
            <p className="text-gray-500 text-sm mt-1">Supplier ID: {invoice.supplierId}</p>
          </div>
          <div className="text-right">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Invoice Period</h3>
            <p className="font-medium text-gray-900">
              {new Date(invoice.periodStart).toLocaleDateString()} - {new Date(invoice.periodEnd).toLocaleDateString()}
            </p>
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2 mt-4">Status</h3>
            <p className="font-medium text-gray-900">{invoice.status}</p>
          </div>
        </div>

        <table className="w-full mb-12">
          <thead>
            <tr className="border-b-2 border-gray-200">
              <th className="text-left py-3 text-sm font-bold text-gray-400 uppercase tracking-wider">Description</th>
              <th className="text-right py-3 text-sm font-bold text-gray-400 uppercase tracking-wider">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            <tr>
              <td className="py-4 text-gray-900">Total Ride Earnings</td>
              <td className="py-4 text-right tabular-nums text-gray-900">
                €{(invoice.rideEarnings / 100).toFixed(2)}
              </td>
            </tr>
            <tr>
              <td className="py-4 text-gray-900">Tip Pass-Through</td>
              <td className="py-4 text-right tabular-nums text-gray-900">
                €{(invoice.tipPassThrough / 100).toFixed(2)}
              </td>
            </tr>
            <tr>
              <td className="py-4 text-gray-900">Platform Commission (Deduction)</td>
              <td className="py-4 text-right tabular-nums text-red-600">
                -€{(invoice.platformCommission / 100).toFixed(2)}
              </td>
            </tr>
          </tbody>
        </table>

        <div className="flex justify-end">
          <div className="w-64">
            <div className="flex justify-between py-3 border-t-2 border-gray-900 font-bold text-lg">
              <span className="text-gray-900">Total</span>
              <span className="tabular-nums text-gray-900">
                €{(invoice.totalAmount / 100).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

InvoicePrintTemplate.displayName = 'InvoicePrintTemplate';
