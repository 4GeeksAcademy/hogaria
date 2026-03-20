import enum
from hmac import compare_digest
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean, Enum as SQLEnum, Float, Integer, Column, ForeignKey, Table, Text, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime
from flask_bcrypt import generate_password_hash, check_password_hash

db = SQLAlchemy()

service_city = Table(
    "service_city",
    db.metadata,
    Column("city_id", ForeignKey("city.id")),
    Column("service_id", ForeignKey("service.id"))
)


class User(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    password_hash: Mapped[str] = mapped_column(nullable=False)
    name: Mapped[str] = mapped_column(nullable=False)
    lastname: Mapped[str] = mapped_column(nullable=False)
    phone: Mapped[str] = mapped_column(nullable=False)
    opinions: Mapped[list["Opinion"]] = relationship(
        "Opinion", back_populates="author")
    history: Mapped[list["Service"]] = relationship(
        "Service", back_populates="user")

    def set_password(self, password):
        self.password_hash = generate_password_hash(password).decode('utf-8')

    def check_password(self, password):
                return check_password_hash(self.password_hash, password)

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            "name": self.name,
            "lastname": self.lastname,
            "phone": self.phone,
            "opinions": [opinion.serialize() for opinion in self.opinions],
            "history": [service.serialize() for service in self.history]
        }




class Company(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(
        String(120), unique=True, nullable=False)
    password_hash: Mapped[str] = mapped_column(nullable=False)
    name: Mapped[str] = mapped_column(nullable=False)
    phone: Mapped[str] = mapped_column(nullable=False)
    rate: Mapped[float] = mapped_column(nullable=True)
    opinions: Mapped[list["Opinion"]] = relationship(
        "Opinion", back_populates="company")
    services: Mapped[list["Service"]] = relationship(
        "Service", back_populates="company")
    
    def set_password(self, password):
        self.password_hash = generate_password_hash(password).decode('utf-8')

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            "name": self.name,
            "phone": self.phone,
            "rate": self.rate,
            "opinions": [opinion.serialize() for opinion in self.opinions],
            "services": [service.serialize() for service in self.services]
        }




class City(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(nullable=False)
    services: Mapped[list["Service"]] = relationship(
        "Service", back_populates="city")

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "services": [service.serialize() for service in self.services]
        }

class ServiceCategory(enum.Enum):
    CERRAJERÍA = "cerrajería"
    CLIMATIZACIÓN = "climatización"
    FONTANERÍA = "fontanería"
    COMERCIOS = "comercios"
    ELECTRICIDAD = "electricidad"
    REFORMAS = "reformas"
    LIMPIEZA = "limpieza"
    MUDANZAS = "mudanzas"
    CATEGORÍA = "categoría"

class Service(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    category: Mapped[str] = mapped_column(SQLEnum(ServiceCategory), default=ServiceCategory.CATEGORÍA, nullable=False)
    name: Mapped[str] = mapped_column(nullable=False)
    city_id: Mapped[int] = mapped_column(ForeignKey("city.id"), nullable=False)
    company_id: Mapped[int] = mapped_column(
        ForeignKey("company.id"), nullable=False)
    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"), nullable=False)
    direction: Mapped[str] = mapped_column(nullable=False)
    all_day: Mapped[bool] = mapped_column(nullable=False)
    price: Mapped[float] = mapped_column(nullable=False)
    city: Mapped["City"] = relationship("City", back_populates="services")
    company: Mapped["Company"] = relationship(
        "Company", back_populates="services")
    user: Mapped["User"] = relationship("User", back_populates="history")

    def serialize(self):
        return {
            "id": self.id,
            "category": self.category,
            "name": self.name,
            "company_id": self.company_id,
            "direction": self.direction,
            "all_day": self.all_day,
            "price": self.price
        }




class Opinion(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"), nullable=False)
    company_id: Mapped[int] = mapped_column(ForeignKey("company.id"), nullable=False)
    rating: Mapped[float] = mapped_column(nullable=False)
    comment: Mapped[str] = mapped_column(nullable=True)
    author: Mapped["User"] = relationship("User", back_populates="opinions")
    company: Mapped["Company"] = relationship("Company", back_populates="opinions")

    def serialize(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "company_id": self.company_id,
            "rating": self.rating,
            "comment": self.comment
        }

# Modelos de la Página Perfil del Usuario


class UserProfile(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(
        ForeignKey("user.id"), unique=True, nullable=False)
    name: Mapped[str] = mapped_column(nullable=False)
    email: Mapped[str] = mapped_column(
        String(120), unique=True, nullable=False)
    phone: Mapped[str] = mapped_column(nullable=False)
    avatar: Mapped[str] = mapped_column(nullable=True)

    user: Mapped["User"] = relationship("User")

    def serialize(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "name": self.name,
            "email": self.email,
            "phone": self.phone,
            "avatar": self.avatar,
        }


class BookingStatus(enum.Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    COMPLETED = "completed"
    CANCELLED = "cancelled"


class PaymentMethodType(enum.Enum):
    CREDIT_CARD = "credit_card"
    DEBIT_CARD = "debit_card"
    PAYPAL = "paypal"
    BANK_TRANSFER = "bank_transfer"


class Booking(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"), nullable=False)
    service_name: Mapped[str] = mapped_column(String(255), nullable=False)

    description: Mapped[str] = mapped_column(Text, nullable=True)
    date: Mapped[str] = mapped_column(String(50), nullable=False)
    status: Mapped[BookingStatus] = mapped_column(
        SQLEnum(BookingStatus), default=BookingStatus.PENDING, nullable=False)
    price: Mapped[float] = mapped_column(Float, nullable=False)

    user: Mapped["User"] = relationship("User")

    def serialize(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "service_name": self.service_name,
            "description": self.description,
            "date": self.date if isinstance(self.date, str) else self.date.isoformat(),
            "status": self.status.value,
            "price": self.price,
        }


class PaymentMethod(db.Model):
    "Modelo de Métodos de Pago y Transacciones"
    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"), nullable=False)
    type: Mapped[PaymentMethodType] = mapped_column(
        SQLEnum(PaymentMethodType), nullable=False)
    last_four: Mapped[str] = mapped_column(String(4), nullable=True)
    holder_name: Mapped[str] = mapped_column(String(255), nullable=False)
    is_default: Mapped[bool] = mapped_column(Boolean(), default=False)

    # Campos para transacciones de Stripe
    stripe_payment_intent_id: Mapped[str] = mapped_column(
        String(255), nullable=True, unique=True)
    amount: Mapped[float] = mapped_column(Float, nullable=True)  # En dólares
    currency: Mapped[str] = mapped_column(
        String(3), default="USD", nullable=True)
    description: Mapped[str] = mapped_column(String(255), nullable=True)
    # pending, succeeded, failed, cancelled
    status: Mapped[str] = mapped_column(
        String(50), default="pending", nullable=True)
    customer_email: Mapped[str] = mapped_column(String(120), nullable=True)

    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user: Mapped["User"] = relationship("User")

    def serialize(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "type": self.type.value,
            "last_four": self.last_four,
            "holder_name": self.holder_name,
            "is_default": self.is_default,
            "stripe_payment_intent_id": self.stripe_payment_intent_id,
            "amount": self.amount,
            "currency": self.currency,
            "description": self.description,
            "status": self.status,
            "customer_email": self.customer_email,
            "created_at": self.created_at.isoformat() if isinstance(self.created_at, datetime) else self.created_at,
            "updated_at": self.updated_at.isoformat() if isinstance(self.updated_at, datetime) else self.updated_at,
        }


class Notification(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("user.id"), nullable=False)

    title: Mapped[str] = mapped_column(String(255), nullable=False)
    message: Mapped[str] = mapped_column(Text, nullable=False)
    is_read: Mapped[bool] = mapped_column(Boolean(), default=False)

    user: Mapped["User"] = relationship("User")

    def serialize(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "title": self.title,
            "message": self.message,
            "is_read": self.is_read,
        }