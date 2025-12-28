import { Head, useForm, router } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { CreditCard, Building2, Wallet, CheckCircle, AlertCircle } from 'lucide-react';
import { formatCurrency } from '@/lib/currency';

interface Reservation {
    reservation_id: number;
    accommodation_name: string;
    check_in_date: string;
    check_out_date: string;
    number_of_guests: number;
    total_cost: number;
    status: string;
}

interface Props {
    reservation?: Reservation;
}

export default function Payment({ reservation }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        payment_method: 'credit_card',
        card_number: '',
        card_name: '',
        expiry_date: '',
        cvv: '',
        billing_address: '',
    });

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        
        if (reservation) {
            // For demo purposes, use placeholder values for non-credit card payments
            const submissionData = {
                payment_method: data.payment_method,
                card_number: data.payment_method === 'credit_card' ? data.card_number : 'DEMO-0000-0000-0000',
                card_name: data.payment_method === 'credit_card' ? data.card_name : 'Demo Payment',
                expiry_date: data.payment_method === 'credit_card' ? data.expiry_date : '12/99',
                cvv: data.payment_method === 'credit_card' ? data.cvv : '000',
                billing_address: data.billing_address,
            };

            router.post(`/payments/${reservation.reservation_id}`, submissionData, {
                onSuccess: () => {
                    alert('Payment successful! Your booking is confirmed.');
                },
                onError: (errors) => {
                    console.error('Payment errors:', errors);
                    alert('Payment failed. Please check your details and try again.');
                }
            });
        }
    };

    if (!reservation) {
        return (
            <>
                <Head title="Payment" />
                <Navigation />
                <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50 pt-24 pb-16">
                    <div className="container mx-auto px-4">
                        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-8 text-center">
                            <AlertCircle className="mx-auto text-orange-600 mb-4" size={64} />
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">No Reservation Found</h2>
                            <p className="text-gray-600 mb-6">Please complete your booking first.</p>
                            <a 
                                href="/reservations/create" 
                                className="inline-block bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-xl font-semibold transition-all"
                            >
                                Make a Reservation
                            </a>
                        </div>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    const calculateNights = () => {
        const checkIn = new Date(reservation.check_in_date);
        const checkOut = new Date(reservation.check_out_date);
        return Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
    };

    return (
        <>
            <Head title="Payment" />
            <Navigation />

            <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50 pt-24 pb-16">
                <div className="container mx-auto px-4 lg:px-8">
                    <div className="mb-8 text-center">
                        <h1 className="text-5xl font-bold text-gray-800 mb-4">Complete Your Payment</h1>
                        <p className="text-gray-600 text-lg">Secure your reservation with payment</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Payment Form */}
                        <div className="lg:col-span-2">
                            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-8 space-y-8">
                                {/* Payment Method Selection */}
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Select Payment Method</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <button
                                            type="button"
                                            onClick={() => setData('payment_method', 'credit_card')}
                                            className={`p-4 rounded-xl border-2 transition-all ${
                                                data.payment_method === 'credit_card'
                                                    ? 'border-orange-600 bg-orange-50 text-orange-600'
                                                    : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                        >
                                            <CreditCard className="mx-auto mb-2" size={32} />
                                            <div className="font-semibold">Credit/Debit Card</div>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setData('payment_method', 'bank_transfer')}
                                            className={`p-4 rounded-xl border-2 transition-all ${
                                                data.payment_method === 'bank_transfer'
                                                    ? 'border-orange-600 bg-orange-50 text-orange-600'
                                                    : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                        >
                                            <Building2 className="mx-auto mb-2" size={32} />
                                            <div className="font-semibold">Bank Transfer</div>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setData('payment_method', 'e_wallet')}
                                            className={`p-4 rounded-xl border-2 transition-all ${
                                                data.payment_method === 'e_wallet'
                                                    ? 'border-orange-600 bg-orange-50 text-orange-600'
                                                    : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                        >
                                            <Wallet className="mx-auto mb-2" size={32} />
                                            <div className="font-semibold">E-Wallet</div>
                                        </button>
                                    </div>
                                </div>

                                {/* Credit Card Form */}
                                {data.payment_method === 'credit_card' && (
                                    <div className="space-y-6">
                                        <h3 className="text-xl font-semibold text-gray-800">Card Information</h3>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Card Number
                                            </label>
                                            <input
                                                type="text"
                                                value={data.card_number}
                                                onChange={(e) => setData('card_number', e.target.value)}
                                                placeholder="1234 5678 9012 3456"
                                                maxLength={19}
                                                className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                                                    errors.card_number ? 'border-red-500' : 'border-gray-200'
                                                }`}
                                            />
                                            {errors.card_number && (
                                                <p className="text-red-500 text-sm mt-1">{errors.card_number}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Cardholder Name
                                            </label>
                                            <input
                                                type="text"
                                                value={data.card_name}
                                                onChange={(e) => setData('card_name', e.target.value)}
                                                placeholder="John Doe"
                                                className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                                                    errors.card_name ? 'border-red-500' : 'border-gray-200'
                                                }`}
                                            />
                                            {errors.card_name && (
                                                <p className="text-red-500 text-sm mt-1">{errors.card_name}</p>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Expiry Date
                                                </label>
                                                <input
                                                    type="text"
                                                    value={data.expiry_date}
                                                    onChange={(e) => setData('expiry_date', e.target.value)}
                                                    placeholder="MM/YY"
                                                    maxLength={5}
                                                    className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                                                        errors.expiry_date ? 'border-red-500' : 'border-gray-200'
                                                    }`}
                                                />
                                                {errors.expiry_date && (
                                                    <p className="text-red-500 text-sm mt-1">{errors.expiry_date}</p>
                                                )}
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    CVV
                                                </label>
                                                <input
                                                    type="text"
                                                    value={data.cvv}
                                                    onChange={(e) => setData('cvv', e.target.value)}
                                                    placeholder="123"
                                                    maxLength={4}
                                                    className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                                                        errors.cvv ? 'border-red-500' : 'border-gray-200'
                                                    }`}
                                                />
                                                {errors.cvv && (
                                                    <p className="text-red-500 text-sm mt-1">{errors.cvv}</p>
                                                )}
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Billing Address
                                            </label>
                                            <textarea
                                                value={data.billing_address}
                                                onChange={(e) => setData('billing_address', e.target.value)}
                                                rows={3}
                                                placeholder="Enter your billing address"
                                                className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                                                    errors.billing_address ? 'border-red-500' : 'border-gray-200'
                                                }`}
                                            />
                                            {errors.billing_address && (
                                                <p className="text-red-500 text-sm mt-1">{errors.billing_address}</p>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Bank Transfer Instructions */}
                                {data.payment_method === 'bank_transfer' && (
                                    <div className="space-y-4 p-6 bg-blue-50 rounded-xl">
                                        <h3 className="text-xl font-semibold text-gray-800">Bank Transfer Details</h3>
                                        <div className="space-y-2 text-gray-700">
                                            <p><strong>Bank Name:</strong> Paradise Bank</p>
                                            <p><strong>Account Name:</strong> Paradise Resort Inc.</p>
                                            <p><strong>Account Number:</strong> 1234-5678-9012-3456</p>
                                            <p><strong>SWIFT Code:</strong> PARDBANKPH</p>
                                            <p className="text-sm text-gray-600 mt-4">
                                                Please transfer the exact amount and use your reservation ID as reference.
                                                Send the proof of payment to payments@paradiseresort.com
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* E-Wallet Instructions */}
                                {data.payment_method === 'e_wallet' && (
                                    <div className="space-y-4 p-6 bg-purple-50 rounded-xl">
                                        <h3 className="text-xl font-semibold text-gray-800">E-Wallet Payment</h3>
                                        <div className="space-y-2 text-gray-700">
                                            <p><strong>Supported E-Wallets:</strong></p>
                                            <ul className="list-disc list-inside space-y-1">
                                                <li>GCash</li>
                                                <li>PayMaya</li>
                                                <li>PayPal</li>
                                            </ul>
                                            <p className="text-sm text-gray-600 mt-4">
                                                You will be redirected to the payment gateway to complete your transaction.
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* Security Notice */}
                                <div className="flex items-start gap-3 p-4 bg-green-50 rounded-xl">
                                    <CheckCircle className="text-green-600 flex-shrink-0 mt-1" size={20} />
                                    <div className="text-sm text-gray-700">
                                        <p className="font-semibold mb-1">Secure Payment</p>
                                        <p>Your payment information is encrypted and secure. We never store your full card details.</p>
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {processing ? 'Processing Payment...' : `Pay ${formatCurrency(reservation.total_cost)}`}
                                </button>
                            </form>
                        </div>

                        {/* Reservation Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
                                <h3 className="text-2xl font-bold text-gray-800 mb-6">Reservation Summary</h3>

                                <div className="space-y-4 mb-6">
                                    <div>
                                        <div className="text-sm text-gray-600">Accommodation</div>
                                        <div className="font-semibold text-gray-800">{reservation.accommodation_name}</div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <div className="text-sm text-gray-600">Check-in</div>
                                            <div className="font-semibold text-gray-800">
                                                {new Date(reservation.check_in_date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-sm text-gray-600">Check-out</div>
                                            <div className="font-semibold text-gray-800">
                                                {new Date(reservation.check_out_date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <div className="text-sm text-gray-600">Nights</div>
                                            <div className="font-semibold text-gray-800">{calculateNights()}</div>
                                        </div>
                                        <div>
                                            <div className="text-sm text-gray-600">Guests</div>
                                            <div className="font-semibold text-gray-800">{reservation.number_of_guests}</div>
                                        </div>
                                    </div>

                                    <div>
                                        <div className="text-sm text-gray-600">Status</div>
                                        <span className="inline-block px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                                            {reservation.status}
                                        </span>
                                    </div>
                                </div>

                                <div className="border-t-2 border-gray-200 pt-4">
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="text-lg font-semibold text-gray-700">Total Amount</span>
                                        <span className="text-3xl font-bold text-orange-600">
                                            {formatCurrency(reservation.total_cost)}
                                        </span>
                                    </div>
                                </div>

                                <div className="mt-6 p-4 bg-orange-50 rounded-xl">
                                    <p className="text-sm text-gray-700">
                                        <strong>Reservation ID:</strong> #{reservation.reservation_id}
                                    </p>
                                    <p className="text-xs text-gray-600 mt-2">
                                        Please keep this ID for your records and future reference.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </>
    );
}
