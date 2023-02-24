export class SocialLinks {
    private website: string = null;
    private profile: string = null;
    private feeds: string = null;
    private twitter: string = null;
    private discord: string = null;
    private telegram: string = null;
    private medium: string = null;

    public setWebsite(website: string): SocialLinks {
        this.website = website;
        return this;
    }

    public setProfile(profile: string): SocialLinks {
        this.profile = profile;
        return this;
    }

    public setFeeds(feeds: string): SocialLinks {
        this.feeds = feeds;
        return this;
    }

    public setTwitter(twitter: string): SocialLinks {
        this.twitter = twitter;
        return this;
    }

    public setDiscord(discord: string): SocialLinks {
        this.discord = discord;
        return this;
    }

    public setTelegram(telegram: string): SocialLinks {
        this.telegram = telegram;
        return this;
    }

    public setMedium(medium: string): SocialLinks {
        this.medium = medium;
        return this;
    }

    public getWebsite(): string {
        return this.website;
    }

    public getProfile(): string {
        return this.profile;
    }

    public getFeeds(): string {
        return this.feeds;
    }

    public getTwitter(): string {
        return this.twitter;
    }

    public getDiscord(): string {
        return this.discord;
    }

    public getTelegram(): string {
        return this.telegram;
    }

    public getMedium(): string {
        return this.medium;
    }

    public toJson(): string {
        return `{
            "website": ${this.website},
            "profile": ${this.profile},
            "feeds": ${this.feeds},
            "twitter": ${this.twitter},
            "discord": ${this.discord},
            "telegram": ${this.telegram},
            "medium": ${this.medium}
        }`
    }
}
