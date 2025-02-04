export type navbarItemData = {
	url: string;
	displayInNav: boolean;
	displayInFooter: boolean;
	linkText: string;
};

export class NavBarData {
	logo: string | null;
	logoLink: string | null;

	curLink: string = $state('#/');
	links: navbarItemData[];

	constructor(links: navbarItemData[], curLink: string, logo: string | null = null, logoLink: string | null = null) {
		this.links = links;
		this.curLink = curLink;
		this.logo = logo;
		this.logoLink = logoLink;
	}
}