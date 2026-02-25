import { Injectable } from '@angular/core';

export interface TechStackIcon {
  tech: string;
  symbol: string;
  bgColor: string;
  textColor: string;
}

export interface TechStackBrandIcon {
  tech: string;
  className: string;
}

interface TechIconPreset {
  symbol: string;
  bgColor: string;
  textColor: string;
}

@Injectable({ providedIn: 'root' })
export class TechStackIconService {
  private readonly deviconFallbackClass = 'devicon-devicon-plain';

  private readonly deviconAliases: Record<string, string> = {
    ts: 'typescript',
    js: 'javascript',
    'node js': 'node.js',
    'nodejs runtime': 'node.js',
    pg: 'postgresql',
    postgressql: 'postgresql',
    mongo: 'mongodb',
    'tailwind': 'tailwind css',
    'tailwindcss': 'tailwind css',
    'nextjs': 'next.js',
    next: 'next.js',
    'nest js': 'nestjs',
    'socket io': 'socket.io',
    awscloud: 'aws',
    amazonwebservices: 'aws',
    html5: 'html',
    css3: 'css',
  };

  private readonly deviconMap: Record<string, string> = {
    angular: 'devicon-angularjs-plain',
    react: 'devicon-react-original',
    redux: 'devicon-redux-original',
    'next.js': 'devicon-nextjs-plain',
    nextjs: 'devicon-nextjs-plain',
    next: 'devicon-nextjs-plain',
    'node.js': 'devicon-nodejs-plain',
    nodejs: 'devicon-nodejs-plain',
    node: 'devicon-nodejs-plain',
    nestjs: 'devicon-nestjs-plain',
    nest: 'devicon-nestjs-plain',
    sequelize: 'devicon-sequelize-plain',
    typescript: 'devicon-typescript-plain',
    javascript: 'devicon-javascript-plain',
    html: 'devicon-html5-plain',
    html5: 'devicon-html5-plain',
    css: 'devicon-css3-plain',
    css3: 'devicon-css3-plain',
    nginx: 'devicon-nginx-original',
    'tailwind css': 'devicon-tailwindcss-original',
    tailwind: 'devicon-tailwindcss-original',
    tailwindcss: 'devicon-tailwindcss-original',
    postgresql: 'devicon-postgresql-plain',
    postgres: 'devicon-postgresql-plain',
    mongodb: 'devicon-mongodb-plain',
    redis: 'devicon-redis-plain',
    docker: 'devicon-docker-plain',
    aws: 'devicon-amazonwebservices-plain-wordmark',
    azure: 'devicon-azure-plain',
    graphql: 'devicon-graphql-plain',
    'socket.io': 'devicon-socketio-original',
    express: 'devicon-express-original',
    python: 'devicon-python-plain',
    django: 'devicon-django-plain',
    jest: 'devicon-jest-plain',
    cypress: 'devicon-cypressio-plain',
    git: 'devicon-git-plain',
    jenkins: 'devicon-jenkins-line',
    npm: 'devicon-npm-original-wordmark',
    'ci/cd': 'devicon-githubactions-plain',
    github: 'devicon-github-original',
    'github actions': 'devicon-githubactions-plain',
  };

  private readonly techAutocompleteOptions = [
    'Angular',
    'React',
    'Redux',
    'Next.js',
    'Node.js',
    'NestJS',
    'Express',
    'TypeScript',
    'JavaScript',
    'HTML5',
    'CSS3',
    'Tailwind CSS',
    'PostgreSQL',
    'MongoDB',
    'Redis',
    'Docker',
    'Nginx',
    'AWS',
    'Azure',
    'GraphQL',
    'Socket.io',
    'Sequelize',
    'Jest',
    'Cypress',
    'Git',
    'GitHub Actions',
    'Jenkins',
    'Python',
    'Django',
  ];

  private readonly palette = [
    { bgColor: '#DBEAFE', textColor: '#1D4ED8' },
    { bgColor: '#DCFCE7', textColor: '#166534' },
    { bgColor: '#FEF3C7', textColor: '#B45309' },
    { bgColor: '#FCE7F3', textColor: '#BE185D' },
    { bgColor: '#EDE9FE', textColor: '#6D28D9' },
    { bgColor: '#CCFBF1', textColor: '#0F766E' },
    { bgColor: '#FEE2E2', textColor: '#B91C1C' },
    { bgColor: '#E0F2FE', textColor: '#0369A1' },
  ];

  private readonly knownIcons: Record<string, TechIconPreset> = {
    angular: { symbol: 'A', bgColor: '#FEE2E2', textColor: '#BE123C' },
    react: { symbol: 'R', bgColor: '#E0F2FE', textColor: '#0369A1' },
    'node.js': { symbol: 'N', bgColor: '#DCFCE7', textColor: '#166534' },
    node: { symbol: 'N', bgColor: '#DCFCE7', textColor: '#166534' },
    typescript: { symbol: 'TS', bgColor: '#DBEAFE', textColor: '#1D4ED8' },
    javascript: { symbol: 'JS', bgColor: '#FEF3C7', textColor: '#A16207' },
    postgresql: { symbol: 'PG', bgColor: '#E0F2FE', textColor: '#0C4A6E' },
    postgres: { symbol: 'PG', bgColor: '#E0F2FE', textColor: '#0C4A6E' },
    mongodb: { symbol: 'M', bgColor: '#DCFCE7', textColor: '#166534' },
    'socket.io': { symbol: 'S', bgColor: '#F3F4F6', textColor: '#111827' },
    stripe: { symbol: '$', bgColor: '#EDE9FE', textColor: '#6D28D9' },
    'stripe api': { symbol: '$', bgColor: '#EDE9FE', textColor: '#6D28D9' },
    tailwind: { symbol: 'TW', bgColor: '#CCFBF1', textColor: '#0F766E' },
    tailwindcss: { symbol: 'TW', bgColor: '#CCFBF1', textColor: '#0F766E' },
    html: { symbol: 'H', bgColor: '#FEE2E2', textColor: '#C2410C' },
    css: { symbol: 'C', bgColor: '#DBEAFE', textColor: '#1E40AF' },
    docker: { symbol: 'D', bgColor: '#E0F2FE', textColor: '#075985' },
    aws: { symbol: 'AWS', bgColor: '#FEF3C7', textColor: '#92400E' },
    azure: { symbol: 'AZ', bgColor: '#DBEAFE', textColor: '#1D4ED8' },
    graphql: { symbol: 'G', bgColor: '#FCE7F3', textColor: '#BE185D' },
    redis: { symbol: 'R', bgColor: '#FEE2E2', textColor: '#B91C1C' },
  };

  getIcons(stack: string[]): TechStackIcon[] {
    const seen = new Set<string>();

    return stack
      .map(tech => tech.trim())
      .filter(Boolean)
      .filter(tech => {
        const key = this.normalize(tech);
        if (seen.has(key)) {
          return false;
        }

        seen.add(key);
        return true;
      })
      .map(tech => this.createIcon(tech));
  }

  getBrandIcons(stack: string[]): TechStackBrandIcon[] {
    const seen = new Set<string>();

    return stack
      .map(tech => tech.trim())
      .filter(Boolean)
      .map(tech => ({ tech, key: this.resolveDeviconKey(tech) }))
      .filter(item => {
        if (seen.has(item.key)) {
          return false;
        }

        seen.add(item.key);
        return true;
      })
      .map(item => {
        const className = this.deviconMap[item.key] ?? this.deviconFallbackClass;
        return { tech: item.tech, className };
      })
      .filter((item): item is TechStackBrandIcon => item !== null);
  }

  suggestTechName(input: string): string | null {
    const query = input.trim();
    if (query.length < 3) {
      return null;
    }

    const lower = query.toLowerCase();
    const match = this.techAutocompleteOptions.find(option => {
      const optionLower = option.toLowerCase();
      return optionLower.startsWith(lower) && optionLower !== lower;
    });

    return match ?? null;
  }

  private createIcon(tech: string): TechStackIcon {
    const normalized = this.normalize(tech);
    const preset = this.knownIcons[normalized];

    if (preset) {
      return { tech, ...preset };
    }

    const paletteItem = this.palette[this.hash(normalized) % this.palette.length];
    return {
      tech,
      symbol: this.makeSymbol(tech),
      bgColor: paletteItem.bgColor,
      textColor: paletteItem.textColor,
    };
  }

  private normalize(value: string): string {
    return value.trim().toLowerCase();
  }

  private resolveDeviconKey(tech: string): string {
    const normalized = this.normalize(tech);
    if (this.deviconMap[normalized]) {
      return normalized;
    }

    const simplified = normalized.replace(/[^a-z0-9]+/g, ' ').trim();
    if (this.deviconAliases[simplified]) {
      return this.deviconAliases[simplified];
    }

    const compact = simplified.replace(/\s+/g, '');
    if (this.deviconAliases[compact]) {
      return this.deviconAliases[compact];
    }

    return normalized;
  }

  private makeSymbol(tech: string): string {
    const parts = tech
      .replace(/[^a-zA-Z0-9+.# ]/g, ' ')
      .split(/\s+/)
      .filter(Boolean);

    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }

    const token = parts[0] ?? tech;
    const compact = token.replace(/[^a-zA-Z0-9]/g, '');
    return compact.slice(0, 2).toUpperCase() || '•';
  }

  private hash(value: string): number {
    let hash = 0;

    for (let i = 0; i < value.length; i += 1) {
      hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
    }

    return hash;
  }
}
