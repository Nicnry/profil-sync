import { FieldErrors } from 'react-hook-form';
import { CVFormInputs } from '@/types/cv';

export const ERROR_MESSAGES = {
  REQUIRED_ROW_COUNT: "Vous devez sélectionner un nombre de rangées valide",
  CONFIGURE_BLOCKS: "Veuillez configurer au moins un bloc pour votre CV",
  FIX_ERRORS: "Veuillez corriger les erreurs avant d'enregistrer"
};

interface FormErrorsProps {
  errors: FieldErrors<CVFormInputs>;
}

const FormErrors = ({ errors }: FormErrorsProps) => {
  if (Object.keys(errors).length === 0) return null;
  
  return (
    <div className="mb-6 p-3 bg-red-100 text-red-700 rounded">
      <p className="font-medium">Veuillez corriger les erreurs suivantes :</p>
      <ul className="list-disc pl-5 mt-2">
        {errors.rowCount && (
          <li>Vous devez sélectionner un nombre de rangées valide</li>
        )}
        {errors.blocks && (
          <li>Veuillez configurer au moins un bloc pour votre CV</li>
        )}
      </ul>
    </div>
  );
};

export default FormErrors;