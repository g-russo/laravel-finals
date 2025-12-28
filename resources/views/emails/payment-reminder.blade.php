<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Payment Reminder</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f5f5f5;
        }
        .container {
            background-color: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
            background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
            color: white;
            padding: 30px 20px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 28px;
        }
        .content {
            padding: 30px;
        }
        .booking-details {
            background-color: #fff7ed;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
        }
        .booking-details h3 {
            margin-top: 0;
            color: #ea580c;
        }
        .detail-row {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px solid #fed7aa;
        }
        .detail-row:last-child {
            border-bottom: none;
        }
        .detail-label {
            color: #666;
        }
        .detail-value {
            font-weight: 600;
            color: #333;
        }
        .total-row {
            font-size: 18px;
            color: #ea580c;
        }
        .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
            color: white;
            text-decoration: none;
            padding: 15px 40px;
            border-radius: 8px;
            font-weight: 600;
            font-size: 16px;
            margin: 20px 0;
        }
        .warning {
            background-color: #fef3cd;
            border: 1px solid #ffc107;
            border-radius: 8px;
            padding: 15px;
            margin: 20px 0;
        }
        .warning-icon {
            color: #856404;
            font-weight: bold;
        }
        .footer {
            text-align: center;
            padding: 20px;
            background-color: #f8f9fa;
            color: #666;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🏝️ Paradise Resort</h1>
            <p>Payment Reminder</p>
        </div>
        
        <div class="content">
            <p>Dear {{ $reservation->user->full_name ?? $reservation->user->name }},</p>
            
            <p>We noticed that your reservation is still pending payment. To confirm your booking, please complete your payment as soon as possible.</p>
            
            <div class="booking-details">
                <h3>📋 Booking Details</h3>
                <div class="detail-row">
                    <span class="detail-label">Reservation ID:</span>
                    <span class="detail-value">#{{ $reservation->reservation_id }}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Booking:</span>
                    <span class="detail-value">
                        @if($reservation->accommodation)
                            {{ $reservation->accommodation->accommodation_name }}
                        @elseif($reservation->package)
                            {{ $reservation->package->package_name }} (Package)
                        @endif
                    </span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Check-in:</span>
                    <span class="detail-value">{{ $reservation->check_in_date->format('M d, Y') }}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Check-out:</span>
                    <span class="detail-value">{{ $reservation->check_out_date->format('M d, Y') }}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Guests:</span>
                    <span class="detail-value">{{ $reservation->number_of_guests }}</span>
                </div>
                <div class="detail-row total-row">
                    <span class="detail-label">Total Amount:</span>
                    <span class="detail-value">₱{{ number_format($reservation->total_price, 2) }}</span>
                </div>
            </div>
            
            <div class="warning">
                <p><span class="warning-icon">⚠️</span> <strong>Important:</strong> Please complete your payment by the end of today. If payment is not received, your reservation will be automatically cancelled.</p>
            </div>
            
            <div style="text-align: center;">
                <a href="{{ $paymentUrl }}" class="cta-button">Complete Payment Now</a>
            </div>
            
            <p>If you have any questions or need assistance, please don't hesitate to contact our support team.</p>
            
            <p>Best regards,<br><strong>Paradise Resort Team</strong></p>
        </div>
        
        <div class="footer">
            <p>© {{ date('Y') }} Paradise Resort. All rights reserved.</p>
            <p>If you did not make this reservation, please ignore this email.</p>
        </div>
    </div>
</body>
</html>
