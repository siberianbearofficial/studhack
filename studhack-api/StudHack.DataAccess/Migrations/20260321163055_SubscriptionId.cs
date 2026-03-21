using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace StudHack.DataAccess.Migrations
{
    /// <inheritdoc />
    public partial class SubscriptionId : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Educations_Users_UserId",
                table: "Educations");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Subscriptions",
                table: "Subscriptions");

            migrationBuilder.DropIndex(
                name: "IX_Educations_UserId",
                table: "Educations");

            migrationBuilder.AddColumn<Guid>(
                name: "Id",
                table: "Subscriptions",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<Guid>(
                name: "Id",
                table: "EventDates",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<Guid>(
                name: "UserDbId",
                table: "Educations",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_Subscriptions",
                table: "Subscriptions",
                column: "Id");

            migrationBuilder.CreateIndex(
                name: "IX_Subscriptions_EventId",
                table: "Subscriptions",
                column: "EventId");

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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Educations_Users_UserDbId",
                table: "Educations");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Subscriptions",
                table: "Subscriptions");

            migrationBuilder.DropIndex(
                name: "IX_Subscriptions_EventId",
                table: "Subscriptions");

            migrationBuilder.DropIndex(
                name: "IX_Educations_UserDbId",
                table: "Educations");

            migrationBuilder.DropColumn(
                name: "Id",
                table: "Subscriptions");

            migrationBuilder.DropColumn(
                name: "Id",
                table: "EventDates");

            migrationBuilder.DropColumn(
                name: "UserDbId",
                table: "Educations");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Subscriptions",
                table: "Subscriptions",
                columns: new[] { "EventId", "UserId" });

            migrationBuilder.CreateIndex(
                name: "IX_Educations_UserId",
                table: "Educations",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Educations_Users_UserId",
                table: "Educations",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
