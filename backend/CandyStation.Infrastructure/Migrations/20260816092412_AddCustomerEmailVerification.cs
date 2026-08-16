using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CandyStation.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddCustomerEmailVerification : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "EmailVerificationToken",
                table: "Customers",
                type: "nvarchar(64)",
                maxLength: 64,
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "EmailVerificationTokenExpiresAt",
                table: "Customers",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsEmailVerified",
                table: "Customers",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "EmailVerificationToken",
                table: "Customers");

            migrationBuilder.DropColumn(
                name: "EmailVerificationTokenExpiresAt",
                table: "Customers");

            migrationBuilder.DropColumn(
                name: "IsEmailVerified",
                table: "Customers");
        }
    }
}
