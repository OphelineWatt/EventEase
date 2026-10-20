import { useEffect, useRef, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { AddressField } from "@/components/AddressField";
import { Button } from "@/components/Button";
import { Chip } from "@/components/Chip";
import { DateTimeField } from "@/components/DateTimeField";
import { IconButton } from "@/components/IconButton";
import { Input } from "@/components/Input";
import { ScreenTitle } from "@/components/ScreenTitle";
import { CATEGORIES, getCategoryLabel } from "@/constants/categories";
import { colors, fonts, fontSize, spacing } from "@/constants/theme";
import { useEvents } from "@/hooks/useEvents";
import { useKeyboardHeight } from "@/hooks/useKeyboardHeight";
import { t } from "@/i18n";
import { showError } from "@/utils/alerts";
import { getDefaultEventDate } from "@/utils/date";
import { validateRequired } from "@/utils/validation";
import type { RootStackScreenProps } from "@/navigation/types";
import type { AddressSuggestion } from "@/services/geocoding";
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
  // Coordonnées GPS de l'adresse choisie dans les suggestions (undefined si l'adresse est tapée à la main)
  const [coords, setCoords] = useState(() => {
    const loc = existing?.location;
    return loc?.latitude !== undefined && loc.longitude !== undefined
      ? { latitude: loc.latitude, longitude: loc.longitude }
      : undefined;
  });
  const [category, setCategory] = useState<EventCategory>(existing?.category ?? "conference");

  const [errors, setErrors] = useState<{ title?: string; description?: string }>({});
  const [submitting, setSubmitting] = useState(false);

  const scrollRef = useRef<ScrollView>(null);
  // Position verticale du champ Lieu dans le formulaire (mesurée à l'affichage)
  const addressY = useRef(0);
  const [addressFocused, setAddressFocused] = useState(false);
  const keyboardHeight = useKeyboardHeight();

  // Dès que le clavier est ouvert sur le champ Lieu, on fait défiler pour le placer en haut :
  // les suggestions s'affichent alors juste en dessous, au-dessus du clavier
  useEffect(() => {
    if (addressFocused && keyboardHeight > 0) {
      scrollRef.current?.scrollTo({ y: addressY.current - spacing.md, animated: true });
    }
  }, [addressFocused, keyboardHeight]);

  /** Toute modification du texte invalide les coordonnées : elles ne correspondraient plus à l'adresse */
  function handleAddressChange(text: string) {
    setAddress(text);
    setCoords(undefined);
  }

  /** Une suggestion choisie fournit à la fois le texte officiel et les coordonnées GPS */
  function handleAddressSelect(suggestion: AddressSuggestion) {
    setAddress(suggestion.label);
    setCoords({ latitude: suggestion.latitude, longitude: suggestion.longitude });
  }

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
      location: address.trim() ? { address: address.trim(), ...coords } : undefined,
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
    <ScrollView
      ref={scrollRef}
      style={styles.flex}
      // Marge en bas égale au clavier : laisse la place de faire défiler le champ Lieu jusqu'en haut
      contentContainerStyle={[styles.container, { paddingBottom: spacing.xl * 2 + keyboardHeight }]}
      keyboardShouldPersistTaps="handled"
    >
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

      {/* onLayout mesure la position du champ dans le formulaire */}
      <View onLayout={(e) => (addressY.current = e.nativeEvent.layout.y)}>
        <AddressField
          label={t("events.form.location")}
          placeholder={t("events.form.locationPlaceholder")}
          value={address}
          isLocated={!!coords}
          onChangeText={handleAddressChange}
          onSelect={handleAddressSelect}
          onFocus={() => setAddressFocused(true)}
          onBlur={() => setAddressFocused(false)}
        />
      </View>

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
