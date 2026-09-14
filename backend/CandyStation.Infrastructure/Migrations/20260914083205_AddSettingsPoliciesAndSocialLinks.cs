using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CandyStation.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddSettingsPoliciesAndSocialLinks : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "FacebookUrl",
                table: "Settings",
                type: "nvarchar(300)",
                maxLength: 300,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "InstagramUrl",
                table: "Settings",
                type: "nvarchar(300)",
                maxLength: 300,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PrivacyPolicy",
                table: "Settings",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ReturnRefundPolicy",
                table: "Settings",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "TermsOfService",
                table: "Settings",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "TiktokUrl",
                table: "Settings",
                type: "nvarchar(300)",
                maxLength: 300,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "FacebookUrl",
                table: "Settings");

            migrationBuilder.DropColumn(
                name: "InstagramUrl",
                table: "Settings");

            migrationBuilder.DropColumn(
                name: "PrivacyPolicy",
                table: "Settings");

            migrationBuilder.DropColumn(
                name: "ReturnRefundPolicy",
                table: "Settings");

            migrationBuilder.DropColumn(
                name: "TermsOfService",
                table: "Settings");

            migrationBuilder.DropColumn(
                name: "TiktokUrl",
                table: "Settings");
        }
    }
}
