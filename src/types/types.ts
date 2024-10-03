export interface DecodedUser {
	name: string;
	email: string;
	picture: string;
	sub: string;
	user_id: string;
}

export interface Course {
	course_id: string;
	course_name: string;
	user_id: string;
}

