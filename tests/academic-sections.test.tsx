// @vitest-environment jsdom

import React from 'react';
import { cleanup, render, screen, waitFor, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import App from '../App';
import profileData from '../public/profile.json';

beforeEach(() => {
  vi.stubGlobal('fetch', vi.fn(async () => ({
    ok: true,
    status: 200,
    statusText: 'OK',
    json: async () => profileData,
  })));
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

async function renderLoadedApp() {
  render(<App />);
  await waitFor(() => expect(screen.getByRole('heading', { name: '科研项目' })).toBeTruthy());
}

describe('academic list sections', () => {
  it('keeps the protected navigation, hero, and biography content visible', async () => {
    await renderLoadedApp();

    expect(screen.getByRole('button', { name: '首页' })).toBeTruthy();
    expect(screen.getByRole('button', { name: '简介 & 经历' })).toBeTruthy();
    expect(screen.getByRole('heading', { level: 1, name: profileData.profile.name })).toBeTruthy();
    expect(screen.getByRole('heading', { name: '简介 & 教育背景' })).toBeTruthy();
    expect(screen.getByText(profileData.profile.bio)).toBeTruthy();
  });

  it('renders every research project as one compact numbered list item', async () => {
    await renderLoadedApp();
    const section = screen.getByRole('heading', { name: '科研项目' }).closest('section');
    const list = section?.querySelector('ol');

    expect(list).toBeTruthy();
    expect(list?.querySelectorAll(':scope > li')).toHaveLength(profileData.projects.length);
    expect(within(list as HTMLOListElement).getByText(profileData.projects[0].title)).toBeTruthy();
    expect(within(list as HTMLOListElement).getByText(/国家自然科学基金委员会.*主持.*2025\.01/)).toBeTruthy();
  });

  it('renders publications as stable year-descending citations with explicit link semantics', async () => {
    await renderLoadedApp();
    const section = screen.getByRole('heading', { name: '科研论文' }).closest('section');
    const citations = section?.querySelectorAll('ol > li');

    expect(citations).toHaveLength(profileData.publications.length);
    expect(citations?.[0].textContent).toContain(profileData.publications[0].title);
    expect(citations?.[1].textContent).toContain(profileData.publications[1].title);
    expect(citations?.[14].textContent).toContain(profileData.publications[14].title);
    expect(citations?.[0].querySelector('em')).toBeTruthy();

    const kepoLinks = within(citations?.[8] as HTMLElement).getAllByRole('link');
    expect(kepoLinks).toHaveLength(2);
    expect(kepoLinks[0].getAttribute('href')).toBe('https://arxiv.org/pdf/2603.11501');
    expect(kepoLinks[1].textContent).toBe('[PDF]');
    expect(kepoLinks.every(link => link.getAttribute('target') === '_blank')).toBe(true);
    expect(section?.textContent).not.toContain('accept');
  });

  it('separates patents and software copyrights and labels numbers without inventing status', async () => {
    await renderLoadedApp();
    const section = screen.getByRole('heading', { name: '专利软著' }).closest('section');

    expect(within(section as HTMLElement).getByRole('heading', { name: '专利' })).toBeTruthy();
    expect(within(section as HTMLElement).getByRole('heading', { name: '软件著作权' })).toBeTruthy();
    expect(section?.querySelectorAll('[data-kind="patent"]')).toHaveLength(5);
    expect(section?.querySelectorAll('[data-kind="software"]')).toHaveLength(2);
    expect(section?.textContent).toContain('专利号 ZL202110305818.4');
    expect(section?.textContent).toContain('申请号 202210065665.5');
    expect(section?.textContent).toContain('登记号 2022SR0317451');
  });
});
