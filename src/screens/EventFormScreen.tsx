import { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Button } from "@/components/Button";
import { Chip } from "@/components/Chip";
import { DateTimeField } from "@/components/DateTimeField";
import { IconButton } from "@/components/IconButton";
import { Input } from "@/components/Input";
import { ScreenTitle } from "@/components/ScreenTitle";
import { CATEGORIES, getCategoryLabel } from "@/constants/categories";
import { colors, fonts, fontSize, spacing } from "@/constants/theme";
import { useEvents } from "@/hooks/useEvents";
import { t } from "@/i18n";
import { showError } from "@/utils/alerts";
import { getDefaultEventDate } from "@/utils/date";
import { validateRequired } from "@/utils/validation";
import type { RootStackScreenProps } from "@/navigation/types";
import type { EventCategory, EventInput } from "@/types/event";

/** Formulaire de création (sans eventId) ou de modification (avec eventId) d'un événement */
export function EventFormScreen({ navigation, route }: RootStackScreenProps<"EventForm">) {
  const eventId = route.params?.eventId;
  const isEditing = !!eventId;
  const { getEventById, addEvent, updateEvent } = useEvents();

  // En modification : l'événement existant sert à pré-remplir les champs
  const existing = eventId ? getEventById(eventId) : undefined;

  // Valeurs du formulaire (initialisées une seule fois, à l'ouverture de l'écran)
  const [title, setTitle] = useState(existing?.title ?? "");
  const [description, setDescription] = useState(existing?.description ?? "");
  const [date, setDate] = useState(() => (existing ? new Date(existing.date) : getDefaultEventDate()));
  const [address, setAddress] = useState(existing?.location?.address ?? "");
  const [category, setCategory] = useState<EventCategory>(existing?.category ?? "conference");

  const [errors, setErrors] = useState<{ title?: string; description?: string }>({});
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit() {
    // 1. Vérification des champs obligatoires
    const newErrors = {
      title: validateRequired(title, t("events.form.titleRequired")),
      description: validateRequired(description, t("events.form.descriptionRequired")),
    };
    setErrors(newErrors);
    if (newErrors.title || newErrors.description) return;

    // 2. Construction des données attendues par le contexte (EventInput)
    const input: EventInput = {
      title: title.trim(),
      description: description.trim(),
      category,
      date: date.toISOString(), // stockée au format ISO (voir types/event.ts)
      location: address.trim() ? { address: address.trim() } : undefined,
    };

    // 3. Enregistrement puis fermeture du formulaire
    setSubmitting(true);
    try {
      if (eventId) {
        await updateEvent(eventId, input);
      } else {
        await addEvent(input);
      }
      navigation.goBack();
    } catch (error) {
      showError(error);
      setSubmitting(false);
    }
  }

  // Cas rare : l'événement à modifier a été supprimé entre-temps
  if (isEditing && !existing) {
    return (
      <View style={styles.container}>
        <Text style={styles.notFound}>{t("events.notFound")}</Text>
        <Button title={t("common.close")} variant="outline" onPress={() => navigation.goBack()} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.flex} contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.headerRow}>
        <ScreenTitle
          kicker={t("events.form.kicker")}
          title={isEditing ? t("events.form.editTitle") : t("events.form.newTitle")}
        />
        <IconButton icon="close" label={t("events.form.close")} color={colors.text} onPress={() => navigation.goBack()} />
      </View>

      <Input
        label={t("events.form.title")}
        value={title}
        onChangeText={setTitle}
        placeholder={t("events.form.titlePlaceholder")}
        error={errors.title}
      />
      <Input
        label={t("events.form.description")}
        value={description}
        onChangeText={setDescription}
        placeholder={t("events.form.descriptionPlaceholder")}
        multiline
        error={errors.description}
      />

      <View style={styles.dateRow}>
        <DateTimeField label={t("events.form.date")} mode="date" value={date} onChange={setDate} />
        <DateTimeField label={t("events.form.time")} mode="time" value={date} onChange={setDate} />
      </View>

      <Input
        label={t("events.form.location")}
        value={address}
        onChangeText={setAddress}
        placeholder={t("events.form.locationPlaceholder")}
      />

      <View style={styles.categoryField}>
        <Text style={styles.label}>{t("events.form.category")}</Text>
        <View style={styles.chips}>
          {CATEGORIES.map((item) => (
            <Chip
              key={item}
              label={getCategoryLabel(item)}
              selected={category === item}
              onPress={() => setCategory(item)}
            />
          ))}
        </View>
      </View>

      <Button
        title={isEditing ? t("events.form.submitEdit") : t("events.form.submitNew")}
        onPress={handleSubmit}
        loading={submitting}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  container: { padding: spacing.lg, paddingBottom: spacing.xl * 2, gap: spacing.md, backgroundColor: colors.background },
  headerRow: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between" },
  dateRow: { flexDirection: "row", gap: spacing.md },
  categoryField: { gap: spacing.xs + 2 },
  label: { fontFamily: fonts.bodyBold, fontSize: fontSize.sm, color: colors.text },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  notFound: { fontFamily: fonts.body, fontSize: fontSize.md, color: colors.textSecondary },
});
