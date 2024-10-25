export interface DecodedUser {
	name: string;
	email: string;
	picture: string;
	sub: string;
	user_id: string;
}

export interface Course {
	description: ReactNode;
	course_id: string;
	course_name: string;
	user_id: string;
}