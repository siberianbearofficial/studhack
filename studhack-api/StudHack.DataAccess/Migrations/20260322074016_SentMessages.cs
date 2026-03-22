using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace StudHack.DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class SentMessages : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Educations_Users_UserDbId",
                table: "Educations");

            migrationBuilder.DropPrimaryKey(
                name: "PK_EventDates",
                table: "EventDates");

            migrationBuilder.DropIndex(
                name: "IX_Educations_UserDbId",
                table: "Educations");

            migrationBuilder.DropColumn(
                name: "UserDbId",
                table: "Educations");

            migrationBuilder.AddPrimaryKey(
                name: "PK_EventDates",
                table: "EventDates",
                column: "Id");

            migrationBuilder.CreateTable(
                name: "SentMessages",
                columns: table => new
                {
                    IdEventDate = table.Column<Guid>(type: "uuid", nullable: false),
                    IdSubscription = table.Column<Guid>(type: "uuid", nullable: false),
                    Message = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SentMessages", x => new { x.IdEventDate, x.IdSubscription });
                    table.ForeignKey(
                        name: "FK_SentMessages_EventDates_IdEventDate",
                        column: x => x.IdEventDate,
                        principalTable: "EventDates",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_SentMessages_Subscriptions_IdSubscription",
                        column: x => x.IdSubscription,
                        principalTable: "Subscriptions",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_EventDates_EventId",
                table: "EventDates",
                column: "EventId");

            migrationBuilder.CreateIndex(
                name: "IX_Educations_UserId",
                table: "Educations",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_SentMessages_IdSubscription",
                table: "SentMessages",
                column: "IdSubscription");

            migrationBuilder.AddForeignKey(
                name: "FK_Educations_Users_UserId",
                table: "Educations",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Educations_Users_UserId",
                table: "Educations");

            migrationBuilder.DropTable(
                name: "SentMessages");

            migrationBuilder.DropPrimaryKey(
                name: "PK_EventDates",
                table: "EventDates");

            migrationBuilder.DropIndex(
                name: "IX_EventDates_EventId",
                table: "EventDates");

            migrationBuilder.DropIndex(
                name: "IX_Educations_UserId",
                table: "Educations");

            migrationBuilder.AddColumn<Guid>(
                name: "UserDbId",
                table: "Educations",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_EventDates",
                table: "EventDates",
                columns: new[] { "EventId", "StartsAt" });

            migrationBuilder.CreateIndex(
                name: "IX_Educations_UserDbId",
                table: "Educations",
                column: "UserDbId");

            migrationBuilder.AddForeignKey(
                name: "FK_Educations_Users_UserDbId",
                table: "Educations",
                column: "UserDbId",
                principalTable: "Users",
                principalColumn: "Id");
        }
    }
}
