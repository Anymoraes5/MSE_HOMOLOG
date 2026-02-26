export async function popularSelect({
    url,
    selectId,
    valueKey = "descricao",
    textKey = "descricao",
    addDefault = false,
    defaultText = "",
    filterFn = null,
    sortFn = null
}) {
    const select = $(selectId);
    if (!select) return;

    try {
        const response = await fetch(url);
        const dados = await response.json();

        let opcoes = [...dados];

        if (filterFn) opcoes = opcoes.filter(filterFn);
        if (sortFn) opcoes.sort(sortFn);

        select.innerHTML = "";

        if (addDefault) {
            const option = document.createElement("option");
            option.value = "";
            option.text = defaultText;
            select.appendChild(option);
        }

        opcoes.forEach(item => {
            const option = document.createElement("option");
            option.value = item[valueKey];
            option.text = item[textKey];
            select.appendChild(option);
        });

    } catch (error) {
        console.error(`Erro ao carregar ${url}`, error);
    }
}