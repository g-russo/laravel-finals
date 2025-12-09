<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;
use Illuminate\Database\Eloquent\Relations\HasMany;

class User extends Authenticatable implements MustVerifyEmail
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, TwoFactorAuthenticatable, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'full_name',
        'username',
        'email',
        'phone_number',
        'address',
        'city',
        'country',
        'date_of_birth',
        'password',
        'role',
        'email_verified_at',
        'avatar_path',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'two_factor_secret',
        'two_factor_recovery_codes',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'date_of_birth' => 'date',
            'password' => 'hashed',
            'two_factor_confirmed_at' => 'datetime',
        ];
    }

    /**
     * Check if user has admin access
     */
    public function canAccessAdmin(): bool
    {
        return in_array($this->role, ['admin', 'employee']);
    }

    /**
     * Check if user is customer
     */
    public function isCustomer(): bool
    {
        return $this->role === 'customer';
    }

    /**
     * Get user's age from date of birth
     */
    public function getAgeAttribute(): ?int
    {
        return $this->date_of_birth ? $this->date_of_birth->age : null;
    }

    /**
     * Get avatar URL or path
     */
    public function getAvatarAttribute(): ?string
    {
        return $this->avatar_path ? asset($this->avatar_path) : null;
    }

    /**
     * Get full contact information
     */
    public function getFullContactAttribute(): string
    {
        return implode(', ', array_filter([
            $this->phone_number,
            $this->address,
            $this->city,
            $this->country
        ]));
    }

    /**
     * Relationship: User's reservations
     */
    public function reservations(): HasMany
    {
        return $this->hasMany(Reservation::class);
    }
}
