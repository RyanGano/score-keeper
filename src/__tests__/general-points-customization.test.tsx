import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CookiesProvider } from "react-cookie";
import { beforeEach, describe, expect, it } from "vitest";
import { GeneralPoints } from "../games/general-points/general-points";

function renderGeneralPoints() {
  return render(
    <CookiesProvider>
      <GeneralPoints onGameStatusChanged={() => {}} />
    </CookiesProvider>
  );
}

describe("general-points customization", () => {
  beforeEach(() => {
    document.cookie = "players_gp=; Max-Age=0; path=/";
  });

  it("allows roster changes after starting but before entering scores", async () => {
    const user = userEvent.setup();
    renderGeneralPoints();

    await user.click(screen.getByRole("button", { name: "Start Game" }));
    await user.click(screen.getByRole("button", { name: "Game settings" }));

    await user.click(screen.getByRole("button", { name: "Remove Player 2" }));
    expect(screen.queryByRole("dialog", { name: "Remove Player" })).toBeNull();

    await user.click(screen.getByRole("button", { name: "Add player" }));
    const addPlayerDialog = await screen.findByRole("dialog", {
      name: "Add New Player",
    });
    await user.type(
      within(addPlayerDialog).getByPlaceholderText("name"),
      "Player 3"
    );
    await user.click(
      within(addPlayerDialog).getByRole("button", { name: "Add Player" })
    );

    await user.click(screen.getByRole("button", { name: "Save Settings" }));
    await user.click(
      screen.getByText("Enter Round 1 Scores")
    );

    const scoreDialog = await screen.findByRole("dialog", {
      name: "Round 1 Scores",
    });
    expect(within(scoreDialog).getByText("Player 1")).toBeInTheDocument();
    expect(within(scoreDialog).getByText("Player 3")).toBeInTheDocument();
    expect(within(scoreDialog).queryByText("Player 2")).toBeNull();
  });

  it("keeps score history on renamed players and gives new players zeroes", async () => {
    const user = userEvent.setup();
    renderGeneralPoints();

    await user.click(screen.getByRole("button", { name: "Start Game" }));
    await user.click(screen.getByText("Enter Round 1 Scores"));

    const scoreInputs = await screen.findAllByPlaceholderText("score");
    await user.type(scoreInputs[0], "12");
    await user.type(scoreInputs[1], "-3");
    await user.click(screen.getByRole("button", { name: "Add Scores" }));

    await user.click(screen.getByRole("button", { name: "Game settings" }));
    await user.click(screen.getByRole("button", { name: "Edit Player 1" }));
    const editPlayerDialog = await screen.findByRole("dialog", {
      name: "Edit Player",
    });
    const nameInput = within(editPlayerDialog).getByRole("textbox");
    await user.clear(nameInput);
    await user.type(nameInput, "Alice");
    await user.click(
      within(editPlayerDialog).getByRole("button", { name: "Edit Player" })
    );

    await user.click(screen.getByRole("button", { name: "Add player" }));
    const addPlayerDialog = await screen.findByRole("dialog", {
      name: "Add New Player",
    });
    await user.type(
      within(addPlayerDialog).getByPlaceholderText("name"),
      "Player 3"
    );
    await user.click(
      within(addPlayerDialog).getByRole("button", { name: "Add Player" })
    );

    await user.click(screen.getByRole("button", { name: "Remove Player 2" }));
    const removePlayerDialog = await screen.findByRole("dialog", {
      name: "Remove Player",
    });
    expect(
      within(removePlayerDialog).getByText(/delete their score history/)
    ).toBeInTheDocument();
    await user.click(
      within(removePlayerDialog).getByRole("button", { name: "Cancel" })
    );
    expect(
      screen.getByRole("button", { name: "Remove Player 2" })
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Remove Player 2" }));
    const confirmedRemoveDialog = await screen.findByRole("dialog", {
      name: "Remove Player",
    });
    await user.click(
      within(confirmedRemoveDialog).getByRole("button", {
        name: "Remove Player",
      })
    );

    await user.click(screen.getByRole("button", { name: "Save Settings" }));

    expect(screen.getByText("Round: 2")).toBeInTheDocument();
    const scoreTable = screen.getByRole("table");
    expect(
      within(scoreTable).getByRole("columnheader", { name: "Alice" })
    ).toBeInTheDocument();
    expect(
      within(scoreTable).getByRole("columnheader", { name: "Player 3" })
    ).toBeInTheDocument();
    expect(within(scoreTable).queryByText("Player 1")).toBeNull();
    expect(within(scoreTable).queryByText("Player 2")).toBeNull();
    expect(within(scoreTable).getByText("12 (12)")).toBeInTheDocument();
    expect(within(scoreTable).getByText("0 (0)")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "End game" }));
    await user.click(screen.getByRole("button", { name: "Game settings" }));
    await user.click(screen.getByRole("button", { name: "Save Settings" }));
    expect(screen.getByText("Game Over")).toBeInTheDocument();
    expect(within(screen.getByRole("table")).getByText("12 (12)")).toBeInTheDocument();
  });

  it("restores roster and scores when canceling game settings after removing a player", async () => {
    const user = userEvent.setup();
    renderGeneralPoints();

    await user.click(screen.getByRole("button", { name: "Start Game" }));
    await user.click(screen.getByText("Enter Round 1 Scores"));
    const scoreInputs = await screen.findAllByPlaceholderText("score");
    await user.type(scoreInputs[0], "15");
    await user.type(scoreInputs[1], "8");
    await user.click(screen.getByRole("button", { name: "Add Scores" }));

    await user.click(screen.getByRole("button", { name: "Game settings" }));
    await user.click(screen.getByRole("button", { name: "Remove Player 1" }));
    const removeDialog = await screen.findByRole("dialog", {
      name: "Remove Player",
    });
    await user.click(
      within(removeDialog).getByRole("button", { name: "Remove Player" })
    );

    const settingsDialog = screen.getByRole("dialog", {
      name: "General Points Settings",
    });
    await user.click(
      within(settingsDialog).getByRole("button", { name: "Cancel" })
    );

    const scoreTable = screen.getByRole("table");
    expect(
      within(scoreTable).getByRole("columnheader", { name: "Player 1" })
    ).toBeInTheDocument();
    expect(
      within(scoreTable).getByRole("columnheader", { name: "Player 2" })
    ).toBeInTheDocument();
    expect(within(scoreTable).getByText("15 (15)")).toBeInTheDocument();
    expect(within(scoreTable).getByText("8 (8)")).toBeInTheDocument();
  });
});
