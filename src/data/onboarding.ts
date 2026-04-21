import { OnboardingSlide } from '../types';

export const onboardingData: OnboardingSlide[] = [
  {
    id: 'ob_1',
    tag: 'WELCOME, EXPLORER',
    title: '',
    message: "Greetings, traveler. I'm Alex — your companion for Boulder's hidden corners. Together we'll uncover what makes this city unlike any other.",
    image: require('../assets/image/onboard_1.png'),
  },
  {
    id: 'ob_2',
    tag: 'FIVE DISTRICTS',
    title: 'Map the\nCity\'s Soul',
    message: 'Peaks, Streets, Flavors, Minds, and Quiet — five districts, thirty artifacts. Each holds a fragment of Boulder waiting to be collected.',
    image: require('../assets/image/onboard_2.png'),
  },
  {
    id: 'ob_3',
    tag: 'YOUR COLLECTION',
    title: 'Gather\nStamps',
    message: 'Mark places you love. Build your personal atlas. Track your progress as the blank map slowly fills with color and memories.',
    image: require('../assets/image/onboard_3.png'),
  },
  {
    id: 'ob_4',
    tag: 'JOURNAL & WONDERS',
    title: 'Stories\n& Secrets',
    message: "Read the journal entries. Swipe through curious facts. Take the challenge. Every layer reveals something you didn't know about Boulder.",
    image: require('../assets/image/onboard_4.png'),
  },
  {
    id: 'ob_5',
    tag: 'READY',
    title: 'The City\nAwaits',
    message: "Your atlas is blank. Your journal is empty. Your stamps are unearned. Let's begin the collection together.",
    image: require('../assets/image/onboard_5.png'),
  },
];