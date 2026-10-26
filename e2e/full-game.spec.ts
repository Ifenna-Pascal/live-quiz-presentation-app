import { expect, test, type Page } from '@playwright/test'

const shots = process.env.SCREENSHOTS_DIR
async function snap(page: Page, name: string) {
  if (!shots) return
  await page.waitForTimeout(1200) // let entrance animations finish
  await page.screenshot({ path: `${shots}/${name}.png`, fullPage: false })
}

test('a host and a player play a whole game live', async ({ browser }) => {
  // --- host signs up and creates a quiz (desktop) ---
  const hostContext = await browser.newContext({ viewport: { width: 1440, height: 900 } })
  const host = await hostContext.newPage()
  await host.goto('/')
  await snap(host, '01-landing')
  await host.goto('/signup')
  await host.getByLabel('Name').fill('Grace Host')
  await host.getByLabel('Email').fill(`e2e-${Date.now()}@example.com`)
  await host.getByLabel('Password', { exact: true }).fill('password123')
  await host.getByRole('button', { name: 'Create account' }).click()
  await expect(host).toHaveURL(/\/dashboard/)
  await snap(host, '02-dashboard-empty')

  await host.getByRole('button', { name: /New presentation/ }).first().click()
  await host.getByPlaceholder('Friday tech quiz').fill('Friday tech quiz')
  await host.getByRole('button', { name: /Use sample quiz/ }).click()
  await snap(host, '03-editor')
  await host.getByRole('button', { name: 'Create presentation' }).click()
  await expect(host).toHaveURL(/\/host\//)
  const id = host.url().split('/host/')[1]
  await expect(host.getByText('Waiting for players')).toBeVisible()

  // --- player joins from the public link (phone) ---
  const playerContext = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true })
  const player = await playerContext.newPage()
  await player.goto(`/join/${id}`)
  await expect(player.getByText('Friday tech quiz')).toBeVisible()
  await snap(player, '04-join')
  await player.getByLabel('Your name').fill('Ada')
  await player.getByRole('button', { name: /Join now/ }).click()
  await expect(player.getByText("You're in, Ada!")).toBeVisible()
  await snap(player, '05-player-lobby')

  // The host sees the player arrive without reloading.
  await expect(host.getByRole('tab', { name: 'Players 1' })).toBeVisible()
  await snap(host, '06-host-lobby')

  // --- question 1 (15s): a wrong guess, a retry, and the first correct answer wins ---
  await host.getByRole('button', { name: /Start presentation/ }).click()
  await expect(player.getByText('Which planet is known as the Red Planet?')).toBeVisible()
  await expect(host.getByRole('timer')).toBeVisible()
  await snap(player, '07-player-question')

  // Before anyone wins, the leaderboard stays dark.
  await host.getByRole('tab', { name: /Leaderboard/ }).click()
  await expect(host.getByText("The race hasn't started")).toBeVisible()

  await player.getByRole('button', { name: /Venus/ }).click()
  await expect(player.getByText('Not that one. Try another, quick!')).toBeVisible()
  await expect(player.getByLabel('Wrong')).toBeVisible()
  await snap(host, '08-host-live')

  await player.getByRole('button', { name: /Mars/ }).click()
  // The host's screen celebrates the winner straight away…
  await expect(host.getByText('Hooray!')).toBeVisible()
  await expect(host.getByText('got it!')).toBeVisible()
  await snap(host, '09-host-hooray')
  // …and the player sees they won.
  await expect(player.getByText('You answered first!')).toBeVisible()
  await snap(player, '10-player-won')
  // The pop-up closes on its own, and the leaderboard has the point.
  await expect(host.getByText('Hooray!')).toBeHidden({ timeout: 8000 })
  await expect(host.getByText('Ada answered first')).toBeVisible()
  await expect(host.getByText('1 pt', { exact: true }).first()).toBeVisible()
  await snap(host, '11-host-after-win')

  // --- chat both ways ---
  await player.getByRole('button', { name: /^Chat/ }).click()
  await player.getByLabel('Message').fill('gg everyone')
  await player.getByRole('button', { name: 'Send', exact: true }).click()
  await host.getByRole('tab', { name: /Chat/ }).click()
  await expect(host.getByText('gg everyone')).toBeVisible()
  await host.getByLabel('Message').fill('Welcome Ada!')
  await host.getByRole('button', { name: 'Send', exact: true }).click()
  await expect(player.getByText('Welcome Ada!')).toBeVisible()
  await snap(player, '11-player-chat')

  // --- the player's leaderboard ---
  await player.getByRole('button', { name: /^Leaderboard/ }).click()
  await expect(player.getByText('Your position').last()).toBeVisible()
  await snap(player, '11b-player-leaderboard')
  await player.getByRole('button', { name: /^Poll/ }).click()

  // --- question 2: the host ends it early ---
  await host.getByRole('button', { name: /Next/ }).click()
  await expect(host.getByText('Question 2 of 4')).toBeVisible()
  await host.getByRole('button', { name: /End & reveal/ }).click()
  await expect(player.getByRole('paragraph').filter({ hasText: 'Answer revealed' })).toBeVisible()

  // --- question 3 (10s): nobody answers and the time runs out ---
  await host.getByRole('button', { name: /Next/ }).click()
  await expect(player.getByText('How many bits are in a byte?')).toBeVisible()
  await expect(host.getByText("Time's up!", { exact: true })).toBeVisible({ timeout: 15_000 })
  await expect(player.getByText("Time's up!", { exact: true })).toBeVisible()
  await snap(player, '12-player-time-up')

  // --- question 4: an opinion poll, one answer each ---
  await host.getByRole('button', { name: /Next/ }).click()
  await player.getByRole('button', { name: /TypeScript/ }).click()
  await expect(player.getByText('You picked B.')).toBeVisible()

  await host.getByRole('button', { name: /Finish/ }).click()
  await expect(host.getByText("That's a wrap!")).toBeVisible()
  await expect(player.getByText('You finished 1st!')).toBeVisible()
  await snap(host, '13-host-finished')
  await snap(player, '14-player-finished')

  await hostContext.close()
  await playerContext.close()
})
