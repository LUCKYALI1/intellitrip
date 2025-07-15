export const SelectTravelsList = [
    {
        id:1,
        tittle:'Just Me',
        desc:'A sole travels in exploration',
        icon:'✈️',
        pepople:'1'
    },
    {
        id:2,
        tittle:'A Couple',
        desc:'two travels in tandem',
        icon:'🥂',
        pepople:'2 People'
    },
    {
        id:3,
        tittle:'Family',
        desc:'A group of fun loving adv',
        icon:'🏡',
        pepople:'3 to 5 People'
    },
    {
         id:4,
        tittle:'Friends ',
        desc:'A bunch of thrill-seekes',
        icon:'🛥️',
        pepople:'1'
    },
]

export const SelectBudgetOptions = [
    {
         id:1,
        tittle:'Cheep',
        desc:'Stay conscious of costs',
        icon:'💵',
    },
    {
         id:2,
        tittle:'Moderate',
        desc:'Keep cost on the average side',
        icon:'💰',
    },
    {
         id:3,
        tittle:'Luxury',
        desc:'Dont worry about cost',
        icon:'💸',
    }
]
export const AI_PROMPT = 'Generate travel plan for location : {location} , for {days} for {people} with a {budget} , give me a hotels options list with hotelname , hotel address , price , hotel , hotel img url , geo coordinates , rating , descriptions and suggest itinerary with placename , places details , places img url , geo coordinates , ticket pricing , time trevel each of location for {days}with each day with best time to visit in json format.'