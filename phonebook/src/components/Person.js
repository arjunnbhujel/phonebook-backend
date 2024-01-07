import React from "react";

const SinglePerson = ({ person, deletePerson }) => (
	<li>
		{person.name} ---- {person.number}
		<button onClick={() => deletePerson(person.id)}> Delete </button>
	</li>
);

const Person = ({ persons, deletePerson }) => {
	return (
		<div>
			<ul>
				{persons.map((person) => (
					<SinglePerson
						key={person.id}
						person={person}
						deletePerson={deletePerson}
					/>
				))}
			</ul>
		</div>
	);
};

export default Person;
