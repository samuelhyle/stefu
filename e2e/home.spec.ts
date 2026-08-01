import { test, expect } from '@playwright/test'

test('homepage loads and shows hero section', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('h1')).toContainText(/stefu|stefan/i)
  await expect(page.locator('nav')).toBeVisible()
})

test('navigation scrolls to sections', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('link', { name: /episodes/i }).first().click()
  await expect(page.locator('#episodes')).toBeVisible()
})

test('watch page loads for valid video', async ({ page }) => {
  await page.goto('/watch/1')
  await expect(page.locator('h1')).toBeVisible()
})
