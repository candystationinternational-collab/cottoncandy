using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CandyStation.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddProductSeoFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "MetaDescription",
                table: "Products",
                type: "nvarchar(160)",
                maxLength: 160,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "MetaTitle",
                table: "Products",
                type: "nvarchar(70)",
                maxLength: 70,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Slug",
                table: "Products",
                type: "nvarchar(180)",
                maxLength: 180,
                nullable: false,
                defaultValue: "");

            // Backfill existing rows with a unique slug derived from their name before the unique
            // index below is created — every row currently has Slug = '' from the default above,
            // which would otherwise collide.
            migrationBuilder.Sql(@"
                UPDATE Products
                SET Slug = LOWER(
                        REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(
                            LTRIM(RTRIM(Name)),
                        '''', ''), '.', ''), ',', ''), '&', 'and'), '/', '-'), ' ', '-')
                    ) + '-' + CAST(Id AS NVARCHAR(20))
                WHERE Slug = '' OR Slug IS NULL;
            ");

            migrationBuilder.CreateIndex(
                name: "IX_Products_Slug",
                table: "Products",
                column: "Slug",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Products_Slug",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "MetaDescription",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "MetaTitle",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "Slug",
                table: "Products");
        }
    }
}
