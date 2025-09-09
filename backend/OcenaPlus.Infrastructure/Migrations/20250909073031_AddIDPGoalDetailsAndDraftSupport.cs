using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace OcenaPlus.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddIDPGoalDetailsAndDraftSupport : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "SubmittedDate",
                table: "IDPPlans",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SupervisorComments",
                table: "IDPPlans",
                type: "nvarchar(2000)",
                maxLength: 2000,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ApprovalComments",
                table: "IDPGoals",
                type: "nvarchar(1000)",
                maxLength: 1000,
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "ApprovalDate",
                table: "IDPGoals",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ApprovedById",
                table: "IDPGoals",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Details",
                table: "IDPGoals",
                type: "nvarchar(2000)",
                maxLength: 2000,
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsDraft",
                table: "IDPGoals",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<DateTime>(
                name: "SubmittedDate",
                table: "IDPGoals",
                type: "datetime2",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_IDPGoals_ApprovedById",
                table: "IDPGoals",
                column: "ApprovedById");

            migrationBuilder.AddForeignKey(
                name: "FK_IDPGoals_Users_ApprovedById",
                table: "IDPGoals",
                column: "ApprovedById",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_IDPGoals_Users_ApprovedById",
                table: "IDPGoals");

            migrationBuilder.DropIndex(
                name: "IX_IDPGoals_ApprovedById",
                table: "IDPGoals");

            migrationBuilder.DropColumn(
                name: "SubmittedDate",
                table: "IDPPlans");

            migrationBuilder.DropColumn(
                name: "SupervisorComments",
                table: "IDPPlans");

            migrationBuilder.DropColumn(
                name: "ApprovalComments",
                table: "IDPGoals");

            migrationBuilder.DropColumn(
                name: "ApprovalDate",
                table: "IDPGoals");

            migrationBuilder.DropColumn(
                name: "ApprovedById",
                table: "IDPGoals");

            migrationBuilder.DropColumn(
                name: "Details",
                table: "IDPGoals");

            migrationBuilder.DropColumn(
                name: "IsDraft",
                table: "IDPGoals");

            migrationBuilder.DropColumn(
                name: "SubmittedDate",
                table: "IDPGoals");
        }
    }
}
