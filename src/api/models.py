from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean, Enum, Float, Integer, Column, ForeignKey, Table
from sqlalchemy.orm import Mapped, mapped_column, relationship

db = SQLAlchemy()

service_city = Table(
    "service_city",
    db.metadata,
    Column("city_id", ForeignKey("city.id")),
    Column("service_id", ForeignKey("service.id"))
)


class User(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(
        String(120), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(nullable=False)
    firstname: Mapped[str] = mapped_column(nullable=False)
    lastname: Mapped[str] = mapped_column(nullable=False)
    phone: Mapped[str] = mapped_column(nullable=False)
    opinions: Mapped[list["Opinion"]] = relationship(
        "Opinion", back_populates="author")
    history: Mapped[list["Service"]] = relationship(
        "Service", back_populates="user")

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            "firstname": self.firstname,
            "lastname": self.lastname,
            "phone": self.phone,
            "opinions": self.opinions,
            "history": self.history
        }


class Company(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(
        String(120), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(nullable=False)
    name: Mapped[str] = mapped_column(nullable=False)
    phone: Mapped[str] = mapped_column(nullable=False)
    rate: Mapped[float] = mapped_column(nullable=True)
    opinions: Mapped[list["Opinion"]] = relationship(
        "Opinion", back_populates="company")
    services: Mapped[list["Service"]] = relationship(
        "Service", back_populates="company")

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            "name": self.name,
            "phone": self.phone,
            "rate": self.rate,
            "opinions": self.opinions,
            "services": self.services
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
            "services": self.services
        }


class Service(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    category: Mapped[enumerate] = mapped_column(Enum(
        'Transport', 'Accommodation', 'Food', 'House', name='category_enum'), nullable=False)
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
    company_id: Mapped[int] = mapped_column(
        ForeignKey("company.id"), nullable=False)
    rating: Mapped[float] = mapped_column(nullable=False)
    comment: Mapped[str] = mapped_column(nullable=True)
    author: Mapped["User"] = relationship("User", back_populates="opinions")
    company: Mapped["Company"] = relationship(
        "Company", back_populates="opinions")

    def serialize(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "company_id": self.company_id,
            "rating": self.rating,
            "comment": self.comment
        }
