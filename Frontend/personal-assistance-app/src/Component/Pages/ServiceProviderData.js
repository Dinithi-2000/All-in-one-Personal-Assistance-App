export const initialProfileData = (serviceType) => ({
  name: '',
  photo: 'https://via.placeholder.com/200',
  serviceType: serviceType || 'General',
  location: '',
  payRate: [500, 2000],
  selectedLanguages: [],
  about: '',
  // Service-specific fields
  selectedServices: [],
  selectedPetTypes: [],
  selectedSyllabi: [],
  selectedSubjects: [],
  selectedGrades: [],
  selectedAgeGroups: []
});

export const validateProfile = (data) => {
  const errors = {};
  if (!data.name?.trim()) errors.name = 'Name is required';
  if (!data.location?.trim()) errors.location = 'Location is required';
  if (data.payRate[0] > data.payRate[1]) errors.payRate = 'Minimum rate cannot exceed maximum rate';
  if (data.selectedLanguages?.length === 0) errors.selectedLanguages = 'At least one language required';
  if (!data.about?.trim()) errors.about = 'About Me is required';

  switch (data.serviceType) {
    case 'PetCare':
      if (data.selectedServices?.length === 0) errors.selectedServices = 'At least one service required';
      if (data.selectedPetTypes?.length === 0) errors.selectedPetTypes = 'At least one pet type required';
      break;
    case 'ChildCare':
      if (data.selectedServices?.length === 0) errors.selectedServices = 'At least one service required';
      if (data.selectedAgeGroups?.length === 0) errors.selectedAgeGroups = 'At least one age group required';
      break;
    case 'Education':
      if (data.selectedServices?.length === 0) errors.selectedServices = 'At least one subject required';
      if (!data.selectedSyllabi || data.selectedSyllabi.length === 0) errors.selectedSyllabi = 'Syllabus selection required';
      if (!data.selectedSubjects || data.selectedSubjects.length === 0) errors.selectedSubjects = 'Subject selection required';
      if (!data.selectedGrades || data.selectedGrades.length === 0) errors.selectedGrades = 'Grade selection required';
      break;
    default:
      if (data.selectedServices?.length === 0) errors.selectedServices = 'At least one service required';
  }
  return errors;
};