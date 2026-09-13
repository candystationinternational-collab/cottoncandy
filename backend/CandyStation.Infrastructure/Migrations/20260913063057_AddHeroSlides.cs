using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CandyStation.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddHeroSlides : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "HeroSlides",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    DisplayOrder = table.Column<int>(type: "int", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    BackgroundColor = table.Column<string>(type: "nvarchar(9)", maxLength: 9, nullable: false),
                    ItemType = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    ProductId = table.Column<int>(type: "int", nullable: true),
                    BundleId = table.Column<int>(type: "int", nullable: true),
                    TitleOverride = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: true),
                    SubtitleOverride = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    CtaLabel = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HeroSlides", x => x.Id);
                    table.ForeignKey(
                        name: "FK_HeroSlides_Bundles_BundleId",
                        column: x => x.BundleId,
                        principalTable: "Bundles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_HeroSlides_Products_ProductId",
                        column: x => x.ProductId,
                        principalTable: "Products",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_HeroSlides_BundleId",
                table: "HeroSlides",
                column: "BundleId");

            migrationBuilder.CreateIndex(
                name: "IX_HeroSlides_ProductId",
                table: "HeroSlides",
                column: "ProductId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "HeroSlides");
        }
    }
}
