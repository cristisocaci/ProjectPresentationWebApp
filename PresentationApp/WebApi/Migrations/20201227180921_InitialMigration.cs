using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

namespace WebApi.Migrations
{
    public partial class InitialMigration : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    UserId = table.Column<string>(nullable: false),
                    UserName = table.Column<string>(nullable: false),
                    Password = table.Column<string>(nullable: false),
                    Salt = table.Column<string>(nullable: false),
                    FirstName = table.Column<string>(nullable: true),
                    LastName = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.UserId);
                });

            migrationBuilder.CreateTable(
                name: "Projects",
                columns: table => new
                {
                    ProjectId = table.Column<int>(nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn),
                    Title = table.Column<string>(nullable: true),
                    Photo = table.Column<string>(nullable: true),
                    Description = table.Column<string>(nullable: true),
                    Position = table.Column<int>(nullable: false),
                    StartDate = table.Column<DateTime>(nullable: true),
                    EndDate = table.Column<DateTime>(nullable: true),
                    UserId = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Projects", x => x.ProjectId);
                    table.ForeignKey(
                        name: "FK_Projects_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Infos",
                columns: table => new
                {
                    InfoId = table.Column<string>(nullable: false),
                    Type = table.Column<string>(nullable: true),
                    Content = table.Column<string>(nullable: true),
                    Position = table.Column<int>(nullable: false),
                    AdditionalData = table.Column<string>(nullable: true),
                    ProjectId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Infos", x => x.InfoId);
                    table.ForeignKey(
                        name: "FK_Infos_Projects_ProjectId",
                        column: x => x.ProjectId,
                        principalTable: "Projects",
                        principalColumn: "ProjectId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "UserId", "FirstName", "LastName", "Password", "Salt", "UserName" },
                values: new object[] { "0", null, null, "$2a$11$FoyulI2zI7W7wfJhDhwIkeJmwo0w/RiWHB0XitTYYOYQ8xbio.ld.", "-lld", "cristi@la.com" });

            migrationBuilder.InsertData(
                table: "Projects",
                columns: new[] { "ProjectId", "Description", "EndDate", "Photo", "Position", "StartDate", "Title", "UserId" },
                values: new object[] { 1, "Description of project 1", null, "unnamed1.jpg", 0, null, "Demo 1", "0" });

            migrationBuilder.InsertData(
                table: "Projects",
                columns: new[] { "ProjectId", "Description", "EndDate", "Photo", "Position", "StartDate", "Title", "UserId" },
                values: new object[] { 2, "Description of project 1", null, "unnamed1.jpg", 1, null, "Demo 2", "0" });

            migrationBuilder.InsertData(
                table: "Infos",
                columns: new[] { "InfoId", "AdditionalData", "Content", "Position", "ProjectId", "Type" },
                values: new object[,]
                {
                    { "1", "", "Project 1 information #1", 0, 1, "text" },
                    { "2", "", "Project 1 information #2", 1, 1, "text" },
                    { "3", "", "Project 2 information #1", 0, 2, "text" },
                    { "4", "", "Project 2 information #2", 1, 2, "text" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_Infos_ProjectId",
                table: "Infos",
                column: "ProjectId");

            migrationBuilder.CreateIndex(
                name: "IX_Projects_UserId",
                table: "Projects",
                column: "UserId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Infos");

            migrationBuilder.DropTable(
                name: "Projects");

            migrationBuilder.DropTable(
                name: "Users");
        }
    }
}
